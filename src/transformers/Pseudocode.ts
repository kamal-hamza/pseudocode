import type { QuartzTransformerPlugin } from "@quartz-community/types";
import style from "./styles/pseudo.scss";
// @ts-expect-error inline script import handled by esbuild plugin
import script from "./scripts/pseudo.inline.ts";

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
    externalResources() {
      // Inject options globally so the inline script can access them
      const configScript = `window.pseudocodeConfig = ${JSON.stringify(opts)};\n`;

      return {
        css: [
          { content: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.css" },
          { content: "https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css" },
          { content: style }, // Your local SCSS
        ],
        js: [
          {
            src: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.js",
            loadTime: "afterDOMReady",
            contentType: "external",
          },
          {
            src: "https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.js",
            loadTime: "afterDOMReady",
            contentType: "external",
          },
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            spaPreserve: true, // Prevents script from reloading on SPA navigation
            script: configScript + script,
          },
        ],
      };
    },
  };
};
