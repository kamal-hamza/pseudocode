import { createRequire } from 'module';

createRequire(import.meta.url);

// src/transformers/styles/pseudo.scss
var pseudo_default = ".pseudocode-container {\n  overflow-x: auto;\n  margin: 1.5rem 0;\n  border-radius: 5px;\n}\n\n.pseudocode-error {\n  border-left: 4px solid var(--err);\n  padding-left: 1rem;\n}";

// src/transformers/scripts/pseudo.inline.ts
var pseudo_inline_default = 'var n=()=>{let s=document.querySelectorAll(\'code[data-language="pseudo"], code.language-pseudo, pre[data-language="pseudo"] code\');if(s.length===0)return;let r=window.pseudocodeConfig||{};if(!window.pseudocode||!window.katex){setTimeout(n,100);return}for(let o of s){let d="",c=o.querySelectorAll("span[data-line]");c.length>0?d=Array.from(c).map(e=>e.textContent).join(`\n`):d=o.textContent||"";let t=o.closest("figure")||o.closest("pre")||o.parentElement;if(t&&d&&!t.classList.contains("pseudocode-rendered")){let e=document.createElement("div");e.classList.add("pseudocode-container");try{window.pseudocode.render(d,e,{...r,katex:window.katex}),e.classList.add("pseudocode-rendered"),t.replaceWith(e)}catch(a){console.error("Pseudocode.js failed to render:",a),t.classList.add("pseudocode-rendered","pseudocode-error")}}}};typeof document<"u"&&(n(),document.addEventListener("nav",n));\n';

// src/transformers/Pseudocode.ts
var defaultOptions = {
  indentSize: "1.2em",
  lineNumber: true,
  lineNumberPunc: ":",
  noEnd: false
};
var Pseudocode = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };
  return {
    name: "Pseudocode",
    externalResources() {
      const configScript = `window.pseudocodeConfig = ${JSON.stringify(opts)};
`;
      return {
        css: [
          { content: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.css" },
          { content: "https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css" },
          { content: pseudo_default }
          // Your local SCSS
        ],
        js: [
          {
            src: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.js",
            loadTime: "afterDOMReady",
            contentType: "external"
          },
          {
            src: "https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.js",
            loadTime: "afterDOMReady",
            contentType: "external"
          },
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            spaPreserve: true,
            // Prevents script from reloading on SPA navigation
            script: configScript + pseudo_inline_default
          }
        ]
      };
    }
  };
};

export { Pseudocode };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map