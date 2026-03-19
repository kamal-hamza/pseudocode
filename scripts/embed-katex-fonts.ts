import fs from "fs/promises";
import path from "path";

/**
 * Processes KaTeX CSS and embeds font files as base64 data URIs
 * This ensures fonts are available without requiring separate file requests
 */
export async function embedKaTexFonts(cssPath: string): Promise<string> {
  let css = await fs.readFile(cssPath, "utf-8");

  // Find all font-face declarations and extract font URLs
  const fontUrlRegex = /url\s*\(\s*['"]?([^'")\s]+\.[a-z0-9]+)['"]?\s*\)/g;

  const fontMatches = Array.from(css.matchAll(fontUrlRegex));
  const fontsDir = path.dirname(cssPath);

  for (const match of fontMatches) {
    const fontFile = match[1];
    if (!fontFile) continue;
    const fontPath = path.join(fontsDir, fontFile);

    try {
      // Check if file exists
      await fs.access(fontPath);

      // Read the font file and convert to base64
      const fontBuffer = await fs.readFile(fontPath);
      const base64 = fontBuffer.toString("base64");

      // Determine the correct mime type
      const ext = path.extname(fontFile).toLowerCase();
      const mimeTypes: Record<string, string> = {
        ".woff2": "font/woff2",
        ".woff": "font/woff",
        ".ttf": "font/ttf",
        ".otf": "font/otf",
      };
      const mimeType = mimeTypes[ext] || "application/octet-stream";

      // Replace the URL with data URI
      const dataUri = `data:${mimeType};base64,${base64}`;
      css = css.replace(
        new RegExp(
          `url\\s*\\(\\s*['"]?${fontFile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"]?\\s*\\)`,
          "g",
        ),
        `url(${dataUri})`,
      );

      console.log(`✓ Embedded ${fontFile}`);
    } catch (error) {
      console.warn(`⚠ Could not embed ${fontFile}: ${(error as Error).message}`);
    }
  }

  return css;
}

// If running directly, process KaTeX CSS
if (import.meta.url === `file://${process.argv[1]}`) {
  const katexCssPath = path.resolve(
    import.meta.url.replace("file://", ""),
    "../node_modules/katex/dist/katex.min.css",
  );

  embedKaTexFonts(katexCssPath)
    .then((css) => {
      console.log("✓ KaTeX fonts embedded successfully");
      process.stdout.write(css);
    })
    .catch((error) => {
      console.error("✗ Failed to embed KaTeX fonts:", error);
      process.exit(1);
    });
}

export default embedKaTexFonts;
