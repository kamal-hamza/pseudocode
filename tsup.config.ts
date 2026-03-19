import { defineConfig } from "tsup";
import * as sass from "sass";
import * as esbuild from "esbuild";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Embeds KaTeX font files as base64 data URIs in CSS
 * This ensures fonts load without requiring separate file requests
 */
async function embedKaTexFonts(cssContent: string, cssPath: string): Promise<string> {
  let css = cssContent;
  // Capture both simple filenames and paths with directories (e.g., "fonts/KaTeX_Main-Regular.woff2")
  const fontUrlRegex = /url\s*\(\s*['"]?([^'")\s]+\.[a-z0-9]+)['"]?\s*\)/g;
  const fontMatches = Array.from(css.matchAll(fontUrlRegex));
  const cssDirPath = path.dirname(cssPath);

  for (const match of fontMatches) {
    const fontRelPath = match[1];
    if (!fontRelPath) continue;

    // Try to resolve the font file path
    let fontPath = path.join(cssDirPath, fontRelPath);

    try {
      // Check if file exists at the relative path
      await fs.access(fontPath);
    } catch {
      // If not found, try without the directory prefix (in case CSS is processed differently)
      const fileName = path.basename(fontRelPath);
      fontPath = path.join(cssDirPath, fileName);
      try {
        await fs.access(fontPath);
      } catch {
        continue;
      }
    }

    try {
      const fontBuffer = await fs.readFile(fontPath);
      const base64 = fontBuffer.toString("base64");

      const ext = path.extname(fontRelPath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        ".woff2": "font/woff2",
        ".woff": "font/woff",
        ".ttf": "font/ttf",
        ".otf": "font/otf",
      };
      const mimeType = mimeTypes[ext] || "application/octet-stream";
      const dataUri = `data:${mimeType};base64,${base64}`;

      // Replace the URL with data URI
      const oldUrl = `url(${fontRelPath})`;
      css = css.replaceAll(oldUrl, `url(${dataUri})`);
    } catch (error) {
      // fail silently
    }
  }

  return css;
}

const quartzInlineLoader = (): esbuild.Plugin => ({
  name: "quartz-inline-loader",
  setup(build) {
    // Handle ?raw imports (imports file content as string)
    build.onResolve({ filter: /\?raw$/ }, (args) => {
      return {
        path: args.path,
        namespace: "raw-loader",
        pluginData: { resolveDir: args.resolveDir },
      };
    });

    build.onLoad({ filter: /\?raw$/, namespace: "raw-loader" }, async (args) => {
      const realPath = args.path.replace(/\?raw$/, "");
      const result = await build.resolve(realPath, {
        resolveDir: args.pluginData.resolveDir,
        kind: "import-statement",
      });

      if (result.errors.length > 0) {
        return { errors: result.errors };
      }

      let contents = await fs.readFile(result.path, "utf-8");

      // Special handling for KaTeX CSS - embed fonts as base64 data URIs
      if (result.path.includes("katex.min.css")) {
        contents = await embedKaTexFonts(contents, result.path);
      }

      return {
        contents,
        loader: "text",
      };
    });

    // Handle SCSS imports (both normal and ?inline)
    build.onResolve({ filter: /\.scss(\?inline)?$/ }, async (args) => {
      // If it has the suffix, we must resolve it manually to find the file
      if (args.path.endsWith("?inline")) {
        const realPath = args.path.replace(/\?inline$/, "");
        const result = await build.resolve(realPath, {
          resolveDir: args.resolveDir,
          kind: "import-statement",
        });

        if (result.errors.length > 0) {
          return { errors: result.errors };
        }

        return {
          path: result.path,
          namespace: "scss-loader",
        };
      }
      // Otherwise allow default resolution
      return undefined;
    });

    // Load SCSS from custom namespace (from ?inline resolution)
    build.onLoad({ filter: /.*/, namespace: "scss-loader" }, (args) => {
      const result = sass.compile(args.path, { style: "compressed" });
      return {
        contents: result.css,
        loader: "text",
      };
    });

    // Load SCSS from default file namespace (normal imports without suffix)
    build.onLoad({ filter: /\.scss$/ }, (args) => {
      const result = sass.compile(args.path, { style: "compressed" });
      return {
        contents: result.css,
        loader: "text",
      };
    });

    // Load CSS files as text strings, with special handling for KaTeX CSS
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      let css = await fs.readFile(args.path, "utf-8");

      // Special handling for KaTeX CSS - embed fonts as base64 data URIs
      if (args.path.includes("katex.min.css")) {
        css = await embedKaTexFonts(css, args.path);
      }

      return {
        contents: css,
        loader: "text",
      };
    });

    // Compile inline TS to a minified IIFE JavaScript string
    build.onLoad({ filter: /\.inline\.ts$/ }, async (args) => {
      const result = await esbuild.build({
        entryPoints: [args.path],
        bundle: true,
        minify: true,
        write: false,
        format: "iife",
        target: "es2020",
      });
      return {
        contents: result.outputFiles?.[0]?.text || "",
        loader: "text",
      };
    });
  },
});

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  splitting: false,
  outDir: "dist",
  platform: "node",
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
  noExternal: ["katex", "pseudocode"],
  esbuildPlugins: [quartzInlineLoader()],
});
