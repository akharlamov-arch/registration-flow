---
name: vercel-composition-patterns
description: >
  React composition patterns that scale. Use when refactoring components with
  boolean prop proliferation, building flexible component libraries, or
  designing reusable APIs. Triggers on tasks involving compound components,
  render props, context providers, or component architecture. Includes React 19
  API changes.
license: MIT
metadata:
  author: vercel
  version: '1.0.0'
---

# React Composition Patterns

Composition patterns for building flexible, maintainable React components.
Avoid boolean prop proliferation by using compound components, lifting state,
and composing internals.

## When to Apply

- Refactoring components with many boolean props
- Building reusable component libraries
- Designing flexible component APIs
- Reviewing component architecture
- Working with compound components or context providers

## Rule Categories by Priority

| Priority | Category | Impact |
| -------- | ----------------------- | ------ |
| 1 | Component Architecture | HIGH |
| 2 | State Management | MEDIUM |
| 3 | Implementation Patterns | MEDIUM |
| 4 | React 19 APIs | MEDIUM |

## Quick Reference

### 1. Component Architecture (HIGH)

- **Avoid boolean props** — Don't add `isThread`, `isEditing`, `isDMThread` etc. Each boolean doubles possible states. Use composition instead.
- **Use compound components** — Structure complex components with shared context. Each subcomponent accesses shared state via context, not props.

```tsx
// ❌ Boolean prop proliferation
<Composer isThread isEditing={false} channelId="abc" showAttachments />

// ✅ Explicit variant composition
<ThreadComposer channelId="abc" />
```

### 2. State Management (MEDIUM)

- **Decouple state from UI** — Provider is the ONLY place that knows how state is managed. UI components consume the context interface.
- **Generic context interface** — Define `{ state, actions, meta }` interface. Any provider can implement it — enables dependency injection.
- **Lift state into providers** — Move state to dedicated provider so sibling components outside the main UI can access it without prop drilling.

```tsx
// Generic interface pattern
interface ComposerContextValue {
  state: ComposerState       // data
  actions: ComposerActions   // update, submit
  meta: ComposerMeta         // refs, etc.
}
```

### 3. Implementation Patterns (MEDIUM)

- **Explicit variants** — Create dedicated variant components (`ThreadComposer`, `EditComposer`) instead of one component with boolean modes.
- **Children over render props** — Use `children` for composition. Use render props only when parent needs to pass data back to child.

```tsx
// ❌ Render props
<Composer renderHeader={() => <Header />} renderFooter={() => <Footer />} />

// ✅ Children composition
<Composer.Frame>
  <Composer.Header />
  <Composer.Footer>
    <Composer.Submit />
  </Composer.Footer>
</Composer.Frame>
```

### 4. React 19 APIs (MEDIUM)

> ⚠️ React 19+ only. Skip if using React 18 or earlier.

- **No `forwardRef`** — `ref` is now a regular prop.
- **Use `use()` instead of `useContext()`** — Can be called conditionally.

```tsx
// ❌ React 18
const ComposerInput = forwardRef<TextInput, Props>((props, ref) => { ... })
const value = useContext(MyContext)

// ✅ React 19
function ComposerInput({ ref, ...props }: Props & { ref?: React.Ref<TextInput> }) { ... }
const value = use(MyContext)
```
