# Gemini CLI Workflow Mandates

This document outlines the required workflow for implementing designs and features in this project. Adhering to these steps ensures architectural consistency and design precision.

## Design Implementation Workflow

Whenever a task involves implementing a UI from a Figma design, the following steps **MUST** be followed:

### 1. Establish Design Context (MCP)

- Always ask for or join the designated **MCP server channel** (e.g., `e8dmhji7`) to connect to the Figma MCP server.
- Retrieve the specific node information using the provided Figma URL to understand layers, tokens, and layout details.

### 2. Architectural Alignment (FSD)

- Activate the `feature-sliced-design` skill.
- Apply the **"Pages First"** principle: Keep page-specific logic, UI, and components within the page directory (e.g., `src/app/login/`) before extracting to lower layers like `features/` or `entities/`.
- Ensure all slices have a clear **Public API** (`index.ts`).
- Respect the strict top-down import hierarchy: `app → pages → widgets → features → entities → shared`.
- Use steiger to check project structure `linter-folder-generation` for reference.

### 3. Design Token Mapping (Tailwind v4)

- Activate the `figma-to-tailwind-v4-direct` or `tailwind-design-system` skill.
- Map Figma variables directly to the `@theme` tokens defined in `src/app/globals.css`.
- Use the standard utility classes for colors, spacing, and radius to ensure 1:1 design parity.
- **Color Mapping Example:**
  - Figma `surface-main` → `bg-surface-main`
  - Figma `text-primary` → `text-text-primary`
  - Figma `brand-primary` → `bg-brand-primary`

### 4. Validation & Quality Control

- Perform a retrospective check using the FSD expert guidance after implementation.
- **Run `npx steiger src`** to validate architectural compliance. All errors related to new code must be resolved.
- Run `npm run lint` and `npm run build` to verify type safety and build stability before finalizing.
