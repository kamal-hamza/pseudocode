import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";
import style from "./styles/pseudo.scss";
// @ts-expect-error inline script import handled by esbuild plugin
import script from "./scripts/pseudo.inline.ts";

export interface PseudoOptions {
  indentSize?: string;
  lineNumber?: boolean;
  lineNumberPunc?: string;
  noEnd?: boolean;
}

const defaultOptions: PseudoOptions = {
  indentSize: "1.2em",
  lineNumber: true,
  lineNumberPunc: ":",
  noEnd: false,
};

export default ((userOpts?: PseudoOptions) => {
  const opts = { ...defaultOptions, ...userOpts };

  const Pseudo: QuartzComponent = ({ children }: QuartzComponentProps) => {
    // Inject configuration securely so the inline script can read it
    return (
      <>
        <div
          id="pseudocode-config"
          style={{ display: "none" }}
          data-config={JSON.stringify(opts)}
        />
        {children}
      </>
    );
  };

  Pseudo.css = style;
  Pseudo.afterDOMLoaded = script as string;

  return Pseudo;
}) satisfies QuartzComponentConstructor;
