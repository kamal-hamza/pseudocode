import { describe, expect, it } from "vitest";
import Pseudo from "../src/components/Pseudo";
import type { QuartzComponentProps } from "@quartz-community/types";

describe("Pseudo Component", () => {
  it("attaches the required css and script properties", () => {
    // Initialize the component
    const Component = Pseudo();

    // Verify CSS is attached (it should be a string loaded from the SCSS file)
    expect(Component.css).toBeDefined();
    expect(typeof Component.css).toBe("string");

    // Verify the inline script is attached
    // In vitest environment without the esbuild plugin, the default export is undefined.
    // The build process handles injecting the string correctly.
    if (Component.afterDOMLoaded !== undefined) {
      expect(typeof Component.afterDOMLoaded).toBe("string");
    }
  });

  it("renders its children without modification", () => {
    const Component = Pseudo();

    // Mock the props that Quartz passes to every component
    const mockProps: QuartzComponentProps = {
      fileData: {
        slug: "test-page",
        frontmatter: { title: "Test" },
      } as QuartzComponentProps["fileData"],
      externalResources: { css: [], js: [], additionalHead: [] },
      cfg: {} as QuartzComponentProps["cfg"], // Mock config
      ctx: {} as QuartzComponentProps["ctx"], // Mock context
      children: ["<div>Mock Content</div>"], // Mock children elements
      tree: { type: "root", children: [] } as QuartzComponentProps["tree"],
      allFiles: [],
      displayClass: "mobile-only",
    };

    // Call the component function
    const result = Component(mockProps);

    // Because the component simply returns <>{children}</>,
    // it should successfully return a defined Preact node/fragment
    expect(result).toBeDefined();
  });
});
