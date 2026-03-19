import { defineConfig } from "tsup";
import * as sass from "sass";
import * as esbuild from "esbuild";

const quartzInlineLoader = (): esbuild.Plugin => ({
  name: "quartz-inline-loader",
  setup(build) {
    // Compile SCSS to a minified CSS string
    build.onLoad({ filter: /\.scss$/ }, (args) => {
      const result = sass.compile(args.path, { style: "compressed" });
      return {
        contents: result.css,
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
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  esbuildPlugins: [quartzInlineLoader()],
});
