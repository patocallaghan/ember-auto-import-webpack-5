import Plugin, { Tree } from 'broccoli-plugin';
export interface AppendOptions {
    mappings: Map<string, Map<string, string>>;
    passthrough: Map<string, string>;
}
export default class Append extends Plugin {
    private previousUpstreamTree;
    private previousAppendedTree;
    private mappings;
    private reverseMappings;
    private passthrough;
    constructor(upstreamTree: Tree, appendedTree: Tree, options: AppendOptions);
    private get upstreamDir();
    private get appendedDir();
    private diffAppendedTree;
    build(): void;
    private upstreamPatchset;
    private appendedPatchset;
    private handleAppend;
}
