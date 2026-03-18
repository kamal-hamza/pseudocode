declare global {
  interface Window {
    katex: unknown;
    katexLoaded: Promise<void>;
    pseudocode: unknown;
    pseudocodeLoaded: Promise<void>;
  }
}

const loadStylesheet = (href: string) => {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};

const ensureKatexLoaded = (): Promise<void> => {
  if (window.katex) return Promise.resolve();
  if (window.katexLoaded) return window.katexLoaded;

  loadStylesheet("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css");
  window.katexLoaded = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("KaTeX load failed"));
    document.head.appendChild(script);
  });
  return window.katexLoaded;
};

const ensurePseudocodeLoaded = (): Promise<void> => {
  if (window.pseudocode) return Promise.resolve();
  if (window.pseudocodeLoaded) return window.pseudocodeLoaded;

  loadStylesheet("https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css");
  window.pseudocodeLoaded = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Pseudocode.js load failed"));
    document.head.appendChild(script);
  });
  return window.pseudocodeLoaded;
};

const setupPseudocodeRendering = async () => {
  const codeBlocks = document.querySelectorAll(
    'code[data-language="pseudo"], code.language-pseudo, pre[data-language="pseudo"] code',
  );
  if (codeBlocks.length === 0) return;

  // Read options from the hidden config div
  const configEl = document.getElementById("pseudocode-config");
  const options = configEl && configEl.dataset.config ? JSON.parse(configEl.dataset.config) : {};

  try {
    await Promise.all([ensureKatexLoaded(), ensurePseudocodeLoaded()]);
  } catch (e) {
    console.error("Failed to load required libraries:", e);
    return;
  }

  for (const block of codeBlocks) {
    // --- FIX: Reconstruct newlines from the span elements ---
    let content = "";
    const lineSpans = block.querySelectorAll("span[data-line]");

    if (lineSpans.length > 0) {
      // Extract text from each span and join with a newline character
      content = Array.from(lineSpans)
        .map((span) => span.textContent)
        .join("\n");
    } else {
      // Fallback if the syntax highlighter didn't split it into spans
      content = block.textContent || "";
    }

    // FIX: Look for the <figure> wrapper first to prevent leftover styling boxes
    const targetNode = block.closest("figure") || block.closest("pre") || block.parentElement;

    if (targetNode && content && !targetNode.classList.contains("pseudocode-rendered")) {
      const container = document.createElement("div");
      container.classList.add("pseudocode-container");

      try {
        (
          window.pseudocode as {
            render: (
              content: string,
              container: HTMLElement,
              options: Record<string, unknown>,
            ) => void;
          }
        ).render(content, container, {
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

// Execute immediately for direct page loads where 'nav' event already fired
if (typeof document !== "undefined") {
  setupPseudocodeRendering();
  // Keep the listeners, but REMOVED the window.addCleanup block so it works in SPAs
  document.addEventListener("nav", setupPseudocodeRendering);
  document.addEventListener("render", setupPseudocodeRendering);
}

export default "" as unknown;
