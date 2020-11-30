"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qunit_1 = __importDefault(require("qunit"));
const broccoli_1 = __importDefault(require("broccoli"));
const broccoli_source_1 = require("broccoli-source");
const quick_temp_1 = __importDefault(require("quick-temp"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const analyzer_1 = __importDefault(require("../analyzer"));
const { module: Qmodule, test } = qunit_1.default;
Qmodule('analyzer', function (hooks) {
    let builder;
    let upstream;
    let analyzer;
    let pack;
    let babelOptionsWasAccessed = false;
    hooks.beforeEach(function () {
        quick_temp_1.default.makeOrRemake(this, 'workDir', 'auto-import-analyzer-tests');
        fs_extra_1.ensureDirSync(upstream = path_1.join(this.workDir, 'upstream'));
        pack = {
            get babelOptions() {
                babelOptionsWasAccessed = true;
                return {};
            },
            babelMajorVersion: 6,
            fileExtensions: ['js']
        };
        analyzer = new analyzer_1.default(new broccoli_source_1.UnwatchedDir(upstream), pack);
        builder = new broccoli_1.default.Builder(analyzer);
    });
    hooks.afterEach(function () {
        babelOptionsWasAccessed = false;
        fs_extra_1.removeSync(this.workDir);
        if (builder) {
            return builder.cleanup();
        }
    });
    test('babelOptions are accessed only during build', function (assert) {
        return __awaiter(this, void 0, void 0, function* () {
            assert.notOk(babelOptionsWasAccessed);
            yield builder.build();
            assert.ok(babelOptionsWasAccessed);
        });
    });
    test('initial file passes through', function (assert) {
        return __awaiter(this, void 0, void 0, function* () {
            let original = "import 'some-package';";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), original);
            yield builder.build();
            let content = fs_extra_1.readFileSync(path_1.join(builder.outputPath, 'sample.js'), 'utf8');
            assert.equal(content, original);
        });
    });
    test('created file passes through', function (assert) {
        return __awaiter(this, void 0, void 0, function* () {
            yield builder.build();
            let original = "import 'some-package';";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), original);
            yield builder.build();
            let content = fs_extra_1.readFileSync(path_1.join(builder.outputPath, 'sample.js'), 'utf8');
            assert.equal(content, original);
        });
    });
    test('updated file passes through', function (assert) {
        return __awaiter(this, void 0, void 0, function* () {
            let original = "import 'some-package';";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), original);
            yield builder.build();
            let updated = "import 'some-package';\nimport 'other-package';";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), updated);
            yield builder.build();
            let content = fs_extra_1.readFileSync(path_1.join(builder.outputPath, 'sample.js'), 'utf8');
            assert.equal(content, updated);
        });
    });
    test('deleted file passes through', function (assert) {
        return __awaiter(this, void 0, void 0, function* () {
            let original = "import 'some-package';";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), original);
            yield builder.build();
            fs_extra_1.removeSync(path_1.join(upstream, 'sample.js'));
            yield builder.build();
            assert.ok(!fs_extra_1.existsSync(path_1.join(builder.outputPath, 'sample.js')), 'should not exist');
        });
    });
    test('imports discovered in created file', function (assert) {
        return __awaiter(this, void 0, void 0, function* () {
            yield builder.build();
            let original = "import 'some-package';";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), original);
            yield builder.build();
            assert.deepEqual(analyzer.imports, [{
                    isDynamic: false,
                    specifier: 'some-package',
                    path: 'sample.js',
                    package: pack
                }]);
        });
    });
    test('imports remain constant in updated file', function (assert) {
        return __awaiter(this, void 0, void 0, function* () {
            let original = "import 'some-package';";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), original);
            yield builder.build();
            let updated = "import 'some-package';\nconsole.log('hi');";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), updated);
            yield builder.build();
            assert.deepEqual(analyzer.imports, [{
                    isDynamic: false,
                    specifier: 'some-package',
                    path: 'sample.js',
                    package: pack
                }]);
        });
    });
    test('import added in updated file', function (assert) {
        return __awaiter(this, void 0, void 0, function* () {
            let original = "import 'some-package';";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), original);
            yield builder.build();
            let updated = "import 'some-package';\nimport 'other-package';";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), updated);
            yield builder.build();
            assert.deepEqual(analyzer.imports, [{
                    isDynamic: false,
                    specifier: 'some-package',
                    path: 'sample.js',
                    package: pack
                }, {
                    isDynamic: false,
                    specifier: 'other-package',
                    path: 'sample.js',
                    package: pack
                }]);
        });
    });
    test('import removed in updated file', function (assert) {
        return __awaiter(this, void 0, void 0, function* () {
            let original = "import 'some-package';";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), original);
            yield builder.build();
            let updated = "console.log('x');";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), updated);
            yield builder.build();
            assert.deepEqual(analyzer.imports, []);
        });
    });
    test('import removed when file deleted', function (assert) {
        return __awaiter(this, void 0, void 0, function* () {
            let original = "import 'some-package';";
            fs_extra_1.outputFileSync(path_1.join(upstream, 'sample.js'), original);
            yield builder.build();
            fs_extra_1.removeSync(path_1.join(upstream, 'sample.js'));
            yield builder.build();
            assert.deepEqual(analyzer.imports, []);
        });
    });
});
//# sourceMappingURL=analyzer-test.js.map