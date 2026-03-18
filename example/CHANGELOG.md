# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `options` field on `ViewTypeRegistration` — community plugins can pass user-supplied configuration (e.g. feature flags) that gets forwarded to every render invocation via `ViewRendererProps.options`.
- `options` field on `ViewRendererProps` — view renderers receive registration-time options as `Record<string, unknown>`.
- `slug`, `allSlugs`, and `linkResolution` fields on `ViewRendererProps` — view renderers can now resolve internal links correctly.
- `css` and `afterDOMLoaded` fields on `ViewTypeRegistration` — community view types can inject per-page styles and client-side scripts.
- `linkResolution` plugin option (`"absolute" | "relative" | "shortest"`) — controls how internal links are resolved in view renderers, matching the crawl-links plugin setting.

### Fixed

- Added `yaml` and `unist-util-visit` to devDependencies (were listed as peer dependencies but missing from devDependencies, causing `tsc --noEmit` failures).

## [0.2.0]

### Added

- Initial Quartz community plugin template.
