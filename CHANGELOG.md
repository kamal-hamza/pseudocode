# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2024-03-18

### Changed

- Refactored inline script to follow official Quartz v5 script guidelines
- Improved event listener management with proper cleanup handlers
- Added `window.addCleanup()` registration to prevent memory leaks during SPA navigation
- Renamed main function to `setupPseudocodeRendering` for better clarity
- Enhanced tracking of rendered blocks with `pseudocode-rendered` class

## [0.2.1] - 2024-03-18

### Changed

- Refactored `src/index.ts` to follow official Quartz v5 component guidelines
- Improved component constructor pattern with proper option merging
- Enhanced type exports for better TypeScript integration

## [0.2.0] - 2024-03-17

### Added

- Pseudocode component for rendering pseudocode algorithms with KaTeX support
- Render event listener for dynamic content updates (popovers, decryption plugins)
- `init()` function for YAML configuration support in quartz.config.yaml
- Proper TypeScript types and exports for both ES modules and YAML configurations
- Comprehensive test suite for component functionality

### Changed

- Replaced template transformer/filter/emitter plugins with focused Pseudocode component
- Updated quartz manifest to specify component category for Quartz v5
- Improved type safety with proper Window interface declarations
- Enhanced inline script with environment detection for Node.js compatibility

### Fixed

- TypeScript configuration to support `.ts` file imports for inline scripts
- Proper handling of browser-injected scripts in test environment
- Type safety across all component properties and exports

## [Unreleased]
