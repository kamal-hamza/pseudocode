import { QuartzTransformerPlugin } from '@quartz-community/types';
export { PageGenerator, PageMatcher, QuartzComponent, QuartzComponentConstructor, QuartzComponentProps, QuartzEmitterPlugin, QuartzFilterPlugin, QuartzPageTypePlugin, QuartzPageTypePluginInstance, QuartzTransformerPlugin, StringResource, VirtualPage } from '@quartz-community/types';

interface PseudoOptions {
    indentSize?: string;
    lineNumber?: boolean;
    lineNumberPunc?: string;
    noEnd?: boolean;
}
declare const Pseudocode: QuartzTransformerPlugin<PseudoOptions>;

export { type PseudoOptions, Pseudocode };
