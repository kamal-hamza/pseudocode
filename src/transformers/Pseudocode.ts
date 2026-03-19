import type { QuartzTransformerPlugin } from "@quartz-community/types";
// @ts-expect-error: handled by tsup loader
import style from "./styles/pseudo.scss?inline";
import script from "./scripts/pseudo.inline.ts";

// Import CSS as strings (handled by tsup loader and Vitest ?raw)
// @ts-expect-error: handled by tsup loader
import katexCss from "katex/dist/katex.min.css?raw";
// @ts-expect-error: handled by tsup loader
import pseudocodeCss from "pseudocode/build/pseudocode.min.css?raw";

// Import JS as raw strings (handled by tsup loader with ?raw)
// @ts-expect-error: handled by tsup loader
import katexJs from "katex/dist/katex.min.js?raw";
// @ts-expect-error: handled by tsup loader
import pseudocodeJs from "pseudocode/build/pseudocode.min.js?raw";

export interface PseudoOptions {
  indentSize?: string;
  lineNumber?: boolean;
  lineNumberPunc?: string;
  noEnd?: boolean;
}

const defaultOptions: PseudoOptions = {
  indentSize: "1.2em",
  lineNumber: true,
  lineNumberPunc: ":",
  noEnd: false,
};

export const Pseudocode: QuartzTransformerPlugin<PseudoOptions> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };

  return {
    name: "Pseudocode",
    markdownPlugins() {
      return [];
    },
    externalResources() {
      // Pass the options to the window object so the inline script can read them
      const configScript = `window.pseudocodeConfig = ${JSON.stringify(opts)};\n`;

      // Inject libraries into window
      const libraryScript = katexJs + pseudocodeJs + script;

      return {
        css: [
          { content: katexCss, inline: true },
          { content: pseudocodeCss, inline: true },
          { content: style, inline: true },
        ],
        js: [
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            spaPreserve: true,
            script: configScript + libraryScript,
          },
        ],
      };
    },
  };
};
