export { default as Pseudo } from "./components/Pseudo";
export type { PseudoOptions } from "./components/Pseudo";

// Export the init function so YAML users can configure it in quartz.config.yaml
export function init(options?: Record<string, unknown>): void {
  // If you add features to PseudoOptions later,
  // you can capture and process them here.
  const _myOpts = options as Record<string, unknown> | undefined;
}

// Re-export shared types from @quartz-community/types
export type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
  StringResource,
  QuartzTransformerPlugin,
  QuartzFilterPlugin,
  QuartzEmitterPlugin,
  QuartzPageTypePlugin,
  QuartzPageTypePluginInstance,
  PageMatcher,
  PageGenerator,
  VirtualPage,
} from "@quartz-community/types";
