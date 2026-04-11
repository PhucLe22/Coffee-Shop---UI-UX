# Linter And Folder Generation Tools

Utilities for enforcing Feature-Sliced Design architecture and generating
correct folder structures automatically. These tools help maintain
architectural consistency and reduce manual setup errors.

---

## Steiger (Architectural Linter)

Steiger is a universal linter for FSD projects. It validates folder
structures and architectural import rules that traditional ESLint
configurations often cannot detect.

Steiger ensures that slices follow the official FSD dependency rules
and prevents architecture violations during development.

### Usage

Run a one-time architectural validation on your project source:

```text
npx steiger ./src
```

Run in watch mode during development:

```text
npx steiger ./src --watch
```

This continuously checks the architecture and reports violations
as files change.

Core Architecture Rules

The linter validates several architectural rules:

### RuleID - Description

- fsd/public-api Required: Every slice must define a Public API using an index.ts file.
- fsd/no-public-api-sidestep Critical: Prevents importing internal modules by bypassing the slice's Public API.
- fsd/forbidden-imports: Forbids imports from higher layers and cross-imports between slices.
- fsd/no-layer-public-api: Forbids index.ts files at the layer root (e.g., src/entities/index.ts).
- fsd/no-segments-on-sliced-layers: Prevents segments like ui, api, or lib from existing directly inside layer folders.
- fsd/ambiguous-slice-names: Prevents slice names that conflict with reserved Shared segment names.
- fsd/insignificant-slice: Detects slices with zero or only one reference (possible dead code).
- fsd/segments-by-purpose: Encourages grouping files by business domain instead of technical role.

These rules ensure that layer boundaries and public APIs are always respected.

## @feature-sliced/cli (Scaffolding)

Utility to quickly generate layers, slices, and segments from Feature-Sliced Design.

### Installation

```text
npm add -g @feature-sliced/cli
```

This will create a global binary fsd. You can install this CLI locally as well, but then you will need to use npx to run it.
Usage

Generate the Entities layer with a client slice that contains an index file and two segments, ui and api:

```text
fsd entities client --segments ui api
```

Or, for short:

```text
fsd e client -s ui,api
```

If you have at least one slice in your project already, the CLI will know where to generate. Otherwise, it will generate in the current folder, or you can specify the location yourself with the --root or -r option.
Other examples

### Generate the Widgets layer with a bottom-bar slice that has an index file and segments ui and api in the src/ folder:

```text
fsd w bottom-bar -s ui api -r src
fsd widget bottom-bar -s ui,api -r src
fsd widgets bottom-bar --segments ui,api -r src
```

Produces:

```text
src/widgets/bottom-bar/index.(js|ts) (depending on your project)
src/widgets/bottom-bar/ui/
src/widgets/bottom-bar/api/
```

### Generate the Features layer with a slice employee/employee-record inside a slice group employee:

```text
fsd f employee/employee-record
fsd feat employee/employee-record
```

In a detected FSD root1 or current folder, produces:

```text
features/employee/employee-record/index.(js|ts) (depending on your project)
```

### Generate the Entities layer with a user slice inside the src/lib folder, creating it if necessary:

```text
fsd e user -r ./src/lib
fsd entity user --root ./src/lib
```

Produces:

```text
src/lib/entities/user/index.(js|ts) (depending on your project)
```

### Generate the Pages layer with slices edit-note and note-list, each containing segments ui and api:

```text
fsd p edit-note note-list -s ui, api
fsd page edit-note, note-list -s ui api
```

In a detected FSD root1 or current folder, produces:

```text
pages/edit-note/index.(js|ts) (depending on your project)
pages/edit-note/ui/
pages/edit-note/api/
pages/note-list/index.(js|ts)
pages/note-list/ui/
pages/note-list/api/
```

### Generate the Shared layer with segments ui and api and an index file for each segment:

```text
fsd s ui api
fsd s -s ui api
fsd shared ui -s api
```

In a detected FSD root1 or current folder, produces:

```text
shared/ui/index.(js|ts)
shared/api/index.(js|ts)
```
