import { QuartzComponent } from '@quartz-community/types';

interface PseudoOptions {
    indentSize?: string;
    lineNumber?: boolean;
    lineNumberPunc?: string;
    noEnd?: boolean;
}
declare const _default: (userOpts?: PseudoOptions) => QuartzComponent;

export { _default as Pseudo, type PseudoOptions };
