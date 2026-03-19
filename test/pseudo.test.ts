import { describe, expect, it } from "vitest";
import { Pseudocode } from "../src/transformers/Pseudocode";

describe("Pseudocode Transformer", () => {
  it("returns the correct plugin name", () => {
    const plugin = Pseudocode();
    expect(plugin.name).toBe("Pseudocode");
  });

  it("injects default external resources correctly", () => {
    const plugin = Pseudocode();
    // @ts-expect-error Mock context
    const resources = plugin.externalResources ? plugin.externalResources({}) : { css: [], js: [] };

    // CSS
    expect(resources!.css).toBeDefined();
    expect(resources!.css?.length).toBe(3); // KaTeX, Pseudocode, and custom style

    // Verify CSS resources are inline
    resources!.css?.forEach((c) => {
      expect(typeof c).not.toBe("string");
      if (typeof c !== "string") {
        expect(c.inline).toBe(true);
        expect(c.content).toBeDefined();
        expect(typeof c.content).toBe("string");
      }
    });

    // JS
    expect(resources!.js).toBeDefined();
    // We expect exactly one JS resource now (bundled inline script)
    expect(resources!.js?.length).toBe(1);

    const inlineScript = resources!.js![0];

    expect(typeof inlineScript).not.toBe("string");
    if (inlineScript && typeof inlineScript !== "string") {
      expect(inlineScript.contentType).toBe("inline");
      expect(inlineScript.loadTime).toBe("afterDOMReady");
      expect("script" in inlineScript).toBe(true);

      const scriptContent = (inlineScript as { script: string }).script;

      // Check for config injection
      expect(scriptContent).toContain("window.pseudocodeConfig");
      expect(scriptContent).toContain("1.2em"); // Default indentSize

      // Check that it looks like it contains the libraries (significantly large string)
      // KaTeX minified is ~250KB, Pseudocode is ~10KB.
      // This is a rough check to ensure imports worked.
      expect(scriptContent.length).toBeGreaterThan(1000);
    }
  });

  it("respects custom user options", () => {
    const plugin = Pseudocode({ indentSize: "3em", lineNumber: false });
    // @ts-expect-error Mock context
    const resources = plugin.externalResources ? plugin.externalResources({}) : { css: [], js: [] };

    // Inline script containing custom configuration
    const inlineScript = resources!.js?.find(
      (j) => typeof j !== "string" && j.contentType === "inline",
    );
    expect(inlineScript).toBeDefined();
    if (inlineScript && typeof inlineScript !== "string" && "script" in inlineScript) {
      const scriptContent = (inlineScript as { script: string }).script;
      expect(scriptContent).toContain("window.pseudocodeConfig");
      expect(scriptContent).toContain("3em"); // Custom indentSize
      expect(scriptContent).toContain('"lineNumber":false'); // Custom lineNumber
    }
  });
});
