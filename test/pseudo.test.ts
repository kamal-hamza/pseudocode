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
    expect(resources!.css?.length).toBeGreaterThan(0);
    expect(
      resources!.css?.some((c) => typeof c !== "string" && c.content?.includes("katex.min.css")),
    ).toBe(true);
    expect(
      resources!.css?.some(
        (c) => typeof c !== "string" && c.content?.includes("pseudocode.min.css"),
      ),
    ).toBe(true);

    // JS
    expect(resources!.js).toBeDefined();
    expect(resources!.js?.length).toBeGreaterThan(0);
    expect(
      resources!.js?.some(
        (j) =>
          typeof j !== "string" &&
          "src" in j &&
          (j as { src?: string }).src?.includes("katex.min.js"),
      ),
    ).toBe(true);
    expect(
      resources!.js?.some(
        (j) =>
          typeof j !== "string" &&
          "src" in j &&
          (j as { src?: string }).src?.includes("pseudocode.min.js"),
      ),
    ).toBe(true);

    // Inline script containing default configuration
    const inlineScript = resources!.js?.find(
      (j) => typeof j !== "string" && j.contentType === "inline",
    );
    expect(inlineScript).toBeDefined();
    if (inlineScript && typeof inlineScript !== "string" && "script" in inlineScript) {
      expect((inlineScript as { script: string }).script).toContain("window.pseudocodeConfig");
      expect((inlineScript as { script: string }).script).toContain("1.2em"); // Default indentSize
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
      expect((inlineScript as { script: string }).script).toContain("window.pseudocodeConfig");
      expect((inlineScript as { script: string }).script).toContain("3em"); // Custom indentSize
      expect((inlineScript as { script: string }).script).toContain('"lineNumber":false'); // Custom lineNumber
    }
  });
});
