export default class BundleConfig {
    private emberApp;
    constructor(emberApp: any);
    get names(): ReadonlyArray<string>;
    get types(): ReadonlyArray<string>;
    bundleEntrypoint(name: string, type: string): string | undefined;
    bundleForPath(path: string): string;
    get lazyChunkPath(): string;
}
