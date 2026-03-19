import { QuartzTransformerPlugin } from '@quartz-community/types';
export { QuartzTransformerPlugin } from '@quartz-community/types';

interface PseudoOptions {
    indentSize?: string;
    lineNumber?: boolean;
    lineNumberPunc?: string;
    noEnd?: boolean;
}
declare const Pseudocode: QuartzTransformerPlugin<PseudoOptions>;

export { type PseudoOptions, Pseudocode };
