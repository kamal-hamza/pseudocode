// This file is loaded as text by the esbuild plugin and should export a string
// of JavaScript code that will be executed in the browser

declare global {
  interface Window {
    katex: unknown;
    katexLoaded: Promise<void>;
    pseudocode: unknown;
  }
}

// Load KaTeX library if not already loaded
const ensureKatexLoaded = (): Promise<void> => {
  if (window.katex) {
    return Promise.resolve();
  }

  if (window.katexLoaded) {
    return window.katexLoaded;
  }

  window.katexLoaded = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js";
    script.async = true;
    script.onload = () => {
      console.log("KaTeX loaded successfully for pseudocode rendering");
      resolve();
    };
    script.onerror = () => {
      console.error("Failed to load KaTeX from CDN");
      reject(new Error("KaTeX load failed"));
    };
    document.head.appendChild(script);
  });

  return window.katexLoaded;
};

// Load pseudocode.js library if not already loaded
const ensurePseudocodeLoaded = (): Promise<void> => {
  if (window.pseudocode) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.js";
    script.async = true;
    script.onload = () => {
      console.log("Pseudocode.js loaded successfully");
      resolve();
    };
    script.onerror = () => {
      console.error("Failed to load pseudocode.js from CDN");
      reject(new Error("Pseudocode.js load failed"));
    };
    document.head.appendChild(script);
  });
};

const setupPseudocodeRendering = async () => {
  // Find all code blocks that Quartz labeled as 'pseudo'
  const codeBlocks = document.querySelectorAll('code[data-language="pseudo"]');

  if (codeBlocks.length === 0) return;

  try {
    // Ensure both libraries are loaded
    await Promise.all([ensureKatexLoaded(), ensurePseudocodeLoaded()]);
  } catch (e) {
    console.error("Failed to load required libraries for pseudocode rendering:", e);
    return;
  }

  const pseudocode = window.pseudocode as Record<string, unknown>;

  for (const block of codeBlocks) {
    const content = block.textContent;
    const parent = block.parentElement;

    if (parent && content && !parent.classList.contains("pseudocode-rendered")) {
      // Create a container for the rendered algorithm
      const container = document.createElement("div");
      container.classList.add("pseudocode-container");
      container.classList.add("pseudocode-rendered");

      try {
        (
          pseudocode.render as (
            content: string,
            container: HTMLElement,
            options: Record<string, unknown>,
          ) => void
        )(content, container, {
          indentSize: "1.2em",
          lineNumber: true,
          lineNumberPunc: ":",
          noEnd: false,
          katex: window.katex,
        });
        // Replace the code block with the pretty rendered one
        parent.replaceWith(container);
      } catch (e) {
        console.error("Pseudocode.js failed to render:", e);
        console.error("Content:", content);
        // Mark as attempted to avoid infinite retry loops
        parent.classList.add("pseudocode-error");
      }
    }
  }
};

// Set up event listeners for page navigation and DOM updates
// 'nav' fires on every page load/transition
// 'render' fires when DOM is updated in-place (popovers, decryption, dynamic content)
if (typeof document !== "undefined") {
  document.addEventListener("nav", setupPseudocodeRendering);
  document.addEventListener("render", setupPseudocodeRendering);

  // Register cleanup on prenav to prevent memory leaks during SPA navigation
  if (typeof window !== "undefined" && window.addCleanup) {
    window.addCleanup(() => {
      document.removeEventListener("nav", setupPseudocodeRendering);
      document.removeEventListener("render", setupPseudocodeRendering);
    });
  }
}

// Export as default for module compatibility during build
export default "" as unknown;
