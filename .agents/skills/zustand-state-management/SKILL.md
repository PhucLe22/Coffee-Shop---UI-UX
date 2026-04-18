---
name: zustand-state-management

description: Build type-safe global state in React applications with Zustand. Supports TypeScript, persist middleware, devtools, slices pattern, and Next.js SSR.
---

Zustand State Management

Last Updated: 2025-11-28

Latest Version: zustand@5.0.8 (current)

Dependencies: React 18+, TypeScript 5+
Quick Start
Bash

npm install zustand

TypeScript Store (CRITICAL: use create<T>()() double parentheses):
TypeScript

import { create } from 'zustand'

interface BearStore {
bears: number
increase: (by: number) => void
}

const useBearStore = create<BearStore>()((set) => ({
bears: 0,
increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

Use in Components:
TypeScript

const bears = useBearStore((state) => state.bears) // Only re-renders when bears changes
const increase = useBearStore((state) => state.increase)

Core Patterns
Basic Store (JavaScript)
JavaScript

const useStore = create((set) => ({
count: 0,
increment: () => set((state) => ({ count: state.count + 1 })),
}))

TypeScript Store (Recommended)
TypeScript

interface CounterStore { count: number; increment: () => void }

const useStore = create<CounterStore>()((set) => ({
count: 0,
increment: () => set((state) => ({ count: state.count + 1 })),
}))

Persistent Store (survives page reloads)
TypeScript

import { persist, createJSONStorage } from 'zustand/middleware'

const useStore = create<UserPreferences>()(
persist(
(set) => ({ theme: 'system', setTheme: (theme) => set({ theme }) }),
{ name: 'user-preferences', storage: createJSONStorage(() => localStorage) },
),
)

Critical Rules
Always Do

    ✅ Use create<T>()() (double parentheses) in TypeScript for middleware compatibility.

    ✅ Define separate interfaces for state and actions.

    ✅ Use selector functions to extract specific state slices.

    ✅ Use set with updater functions for derived state: set((state) => ({ count: state.count + 1 })).

    ✅ Use unique names for persist middleware storage keys.

    ✅ Handle Next.js hydration with hasHydrated flag pattern.

    ✅ Use shallow for selecting multiple values.

    ✅ Keep actions pure (no side effects except state updates).

Never Do

    ❌ Use create<T>(...) (single parentheses) in TypeScript - breaks middleware types.

    ❌ Mutate state directly: set((state) => { state.count++; return state }) - use immutable updates.

    ❌ Create new objects in selectors: useStore((state) => ({ a: state.a })) - causes infinite renders.

    ❌ Use same storage name for multiple stores - causes data collisions.

    ❌ Access localStorage during SSR without hydration check.

    ❌ Use Zustand for server state - use TanStack Query instead.

    ❌ Export store instance directly - always export the hook.

Known Issues Prevention

This skill prevents 5 documented issues:
Issue #1: Next.js Hydration Mismatch

Error: "Text content does not match server-rendered HTML" or "Hydration failed"

Source: DEV Community: Persist middleware in Next.js | GitHub Discussions #2839

Why It Happens: Persist middleware reads from localStorage on client but not on server, causing state mismatch.

Prevention:
TypeScript

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreWithHydration {
count: number
\_hasHydrated: boolean
setHasHydrated: (hydrated: boolean) => void
increase: () => void
}

const useStore = create<StoreWithHydration>()(
persist(
(set) => ({
count: 0,
\_hasHydrated: false,
setHasHydrated: (hydrated) => set({ \_hasHydrated: hydrated }),
increase: () => set((state) => ({ count: state.count + 1 })),
}),
{
name: 'my-store',
onRehydrateStorage: () => (state) => {
state?.setHasHydrated(true)
},
},
),
)

// In component
function MyComponent() {
const hasHydrated = useStore((state) => state.\_hasHydrated)

if (!hasHydrated) {
return <div>Loading...</div>
}

return <ActualContent />
}

Issue #2: TypeScript Double Parentheses Missing

Error: Type inference fails, StateCreator types break with middleware.

Source: Official Zustand TypeScript Guide.

Why It Happens: The currying syntax create<T>()() is required for middleware to work with TypeScript inference.

Prevention:
TypeScript

// ❌ WRONG - Single parentheses
const useStore = create<MyStore>((set) => ({ /_ ... _/ }))

// ✅ CORRECT - Double parentheses
const useStore = create<MyStore>()((set) => ({ /_ ... _/ }))

Rule: Always use create<T>()() in TypeScript, even without middleware (future-proof).
Issue #3: Persist Middleware Import Error

Error: "Attempted import error: 'createJSONStorage' is not exported from 'zustand/middleware'"

Source: GitHub Discussion #2839.

Why It Happens: Wrong import path or version mismatch between zustand and build tools.

Prevention:
TypeScript

// ✅ CORRECT imports for v5
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Check your package.json: "zustand": "^5.0.8"

Issue #4: Infinite Render Loop

Error: Component re-renders infinitely, browser freezes.

Source: GitHub Discussions #2642.

Why It Happens: Creating new object references in selectors causes Zustand to think state changed.

Prevention:
TypeScript

import { shallow } from 'zustand/shallow'

// ❌ WRONG - Creates new object every time
const { bears, fishes } = useStore((state) => ({
bears: state.bears,
fishes: state.fishes,
}))

// ✅ CORRECT Option 1 - Select primitives separately
const bears = useStore((state) => state.bears)
const fishes = useStore((state) => state.fishes)

// ✅ CORRECT Option 2 - Use shallow for multiple values
const { bears, fishes } = useStore(
(state) => ({ bears: state.bears, fishes: state.fishes }),
shallow,
)

Issue #5: Slices Pattern TypeScript Complexity

Error: StateCreator types fail to infer, complex middleware types break.

Source: Official Slices Pattern Guide.

Why It Happens: Combining multiple slices requires explicit type annotations for middleware compatibility.

Prevention:
TypeScript

import { create, StateCreator } from 'zustand'

interface BearSlice { bears: number; addBear: () => void }
interface FishSlice { fishes: number; addFish: () => void }

const createBearSlice: StateCreator<
BearSlice & FishSlice,
[],
[],
BearSlice

> = (set) => ({
> bears: 0,
> addBear: () => set((state) => ({ bears: state.bears + 1 })),
> })

const createFishSlice: StateCreator<
BearSlice & FishSlice,
[],
[],
FishSlice

> = (set) => ({
> fishes: 0,
> addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
> })

const useStore = create<BearSlice & FishSlice>()((...a) => ({
...createBearSlice(...a),
...createFishSlice(...a),
}))

Middleware
Persist (localStorage)
TypeScript

import { persist, createJSONStorage } from 'zustand/middleware'

const useStore = create<MyStore>()(
persist(
(set) => ({
data: [],
addItem: (item) => set((state) => ({ data: [...state.data, item] }))
}),
{
name: 'my-storage',
partialize: (state) => ({ data: state.data }), // Only persist 'data'
},
),
)

Devtools (Redux DevTools)
TypeScript

import { devtools } from 'zustand/middleware'

const useStore = create<CounterStore>()(
devtools(
(set) => ({
count: 0,
increment: () => set((s) => ({ count: s.count + 1 }), undefined, 'increment')
}),
{ name: 'CounterStore' },
),
)

Combining Middlewares
TypeScript

const useStore = create<MyStore>()(
devtools(
persist((set) => ({ /_ ... _/ }), { name: 'storage' }),
{ name: 'MyStore' }
)
)

Common Patterns

    Computed/Derived Values: const count = useStore((state) => state.items.length)

    Async Actions:

TypeScript

const useAsyncStore = create<AsyncStore>()((set) => ({
data: null,
isLoading: false,
fetchData: async () => {
set({ isLoading: true })
const response = await fetch('/api/data')
set({ data: await response.text(), isLoading: false })
},
}))

    Resetting Store:

TypeScript

const initialState = { count: 0, name: '' }
const useStore = create<ResettableStore>()((set) => ({
...initialState,
reset: () => set(initialState),
}))

    Selector with Params: const todo = useStore((state) => state.todos.find((t) => t.id === id))

Bundled Resources

    Templates: basic-store.ts, typescript-store.ts, persist-store.ts, slices-pattern.ts, devtools-store.ts, nextjs-store.ts, computed-store.ts, async-actions-store.ts

    References: middleware-guide.md, typescript-patterns.md, nextjs-hydration.md, migration-guide.md

    Scripts: check-versions.sh

Advanced Topics
Vanilla Store (Without React)
TypeScript

import { createStore } from 'zustand/vanilla'
const store = createStore<CounterStore>()((set) => ({ count: 0, increment: () => set((s) => ({ count: s.count + 1 })) }))
store.subscribe((state) => console.log(state.count))
store.getState().increment()

Custom Middleware
TypeScript

const logger: Logger = (f, name) => (set, get, store) => {
const loggedSet: typeof set = (...a) => { set(...a); console.log(`[${name}]:`, get()) }
return f(loggedSet, get, store)
}

Immer Middleware (Mutable Updates)
TypeScript

import { immer } from 'zustand/middleware/immer'
const useStore = create<TodoStore>()(immer((set) => ({
todos: [],
addTodo: (text) => set((state) => { state.todos.push({ id: Date.now().toString(), text }) }),
})))

Official Documentation

    Zustand: https://zustand.docs.pmnd.rs/

    GitHub: https://github.com/pmndrs/zustand

    TypeScript Guide: https://zustand.docs.pmnd.rs/guides/typescript

    Context7 Library ID: /pmndrs/zustand
