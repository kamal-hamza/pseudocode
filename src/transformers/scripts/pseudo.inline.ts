/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

const setupPseudocodeRendering = () => {
  const codeBlocks = document.querySelectorAll(
    'code[data-language="pseudo"], code.language-pseudo, pre[data-language="pseudo"] code',
  );
  if (codeBlocks.length === 0) return;

  // Options were injected globally by the transformer
  const options = window.pseudocodeConfig || {};

  // Wait until Quartz finishes loading the CDN scripts
  if (!window.pseudocode || !window.katex) {
    setTimeout(setupPseudocodeRendering, 100);
    return;
  }

  for (const block of codeBlocks) {
    let content = "";
    const lineSpans = block.querySelectorAll("span[data-line]");

    if (lineSpans.length > 0) {
      content = Array.from(lineSpans)
        .map((span) => span.textContent)
        .join("\n");
    } else {
      content = block.textContent || "";
    }

    const targetNode = block.closest("figure") || block.closest("pre") || block.parentElement;

    if (targetNode && content && !targetNode.classList.contains("pseudocode-rendered")) {
      const container = document.createElement("div");
      container.classList.add("pseudocode-container");

      try {
        window.pseudocode.render(content, container, {
          ...options,
          katex: window.katex,
        });

        container.classList.add("pseudocode-rendered");
        targetNode.replaceWith(container);
      } catch (e) {
        console.error("Pseudocode.js failed to render:", e);
        targetNode.classList.add("pseudocode-rendered", "pseudocode-error");
      }
    }
  }
};

if (typeof document !== "undefined") {
  setupPseudocodeRendering();
  document.addEventListener("nav", setupPseudocodeRendering);
}
