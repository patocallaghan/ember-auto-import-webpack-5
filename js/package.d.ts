import { Configuration } from 'webpack';
export declare function reloadDevPackages(): void;
export interface Options {
    exclude?: string[];
    alias?: {
        [fromName: string]: string;
    };
    webpack?: Configuration;
    publicAssetURL?: string;
    forbidEval?: boolean;
    skipBabel?: {
        package: string;
        semverRange?: string;
    }[];
}
export default class Package {
    name: string;
    root: string;
    isAddon: boolean;
    private _options;
    private _parent;
    private _hasBabelDetails;
    private _babelMajorVersion?;
    private _babelOptions;
    private _emberCLIBabelExtensions?;
    private autoImportOptions;
    private isAddonCache;
    private isDeveloping;
    private pkgGeneration;
    private pkgCache;
    static lookup(appOrAddon: any): Package;
    constructor(appOrAddon: any);
    _ensureBabelDetails(): void;
    get babelOptions(): any;
    get babelMajorVersion(): number | undefined;
    get isFastBootEnabled(): boolean;
    private buildBabelOptions;
    private get pkg();
    get namespace(): string;
    hasDependency(name: string): boolean;
    private hasNonDevDependency;
    isEmberAddonDependency(name: string): boolean;
    assertAllowedDependency(name: string): void;
    excludesDependency(name: string): boolean;
    get webpackConfig(): any;
    get skipBabel(): Options["skipBabel"];
    aliasFor(name: string): string;
    get fileExtensions(): string[];
    get publicAssetURL(): string | undefined;
    get forbidsEval(): boolean;
}
