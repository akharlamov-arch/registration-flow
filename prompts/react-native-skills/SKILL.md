---
name: vercel-react-native-skills
description: >
  React Native and Expo best practices for building performant mobile apps. Use
  when building React Native components, optimizing list performance,
  implementing animations, or working with native modules. Triggers on tasks
  involving React Native, Expo, mobile performance, or native platform APIs.
license: MIT
metadata:
  author: vercel
  version: '1.0.0'
---

# React Native Skills

Comprehensive best practices for React Native and Expo applications.

## When to Apply

Reference these guidelines when:
- Building React Native or Expo apps
- Optimizing list and scroll performance
- Implementing animations with Reanimated
- Working with images and media
- Configuring native modules or fonts

## Rule Categories by Priority

| Priority | Category | Impact |
| -------- | ---------------- | -------- |
| 1 | Core Rendering | CRITICAL |
| 2 | List Performance | HIGH |
| 3 | Animation | HIGH |
| 4 | Scroll Performance | HIGH |
| 5 | Navigation | HIGH |
| 6 | React State | MEDIUM |
| 7 | State Architecture | MEDIUM |
| 8 | React Compiler | MEDIUM |
| 9 | User Interface | MEDIUM |
| 10 | Design System | MEDIUM |
| 11 | Monorepo | LOW |
| 12 | Third-Party Dependencies | LOW |
| 13 | JavaScript | LOW |
| 14 | Fonts | LOW |

## Quick Reference

### 1. Core Rendering (CRITICAL)
- **NEVER** use `{value && <Component />}` when value could be `0` or `""` — causes crash. Use ternary with `null`.
- Strings **must** be inside `<Text>` — never a direct child of `<View>`.

### 2. List Performance (HIGH)
- Use `LegendList` or `FlashList` — never `ScrollView` with mapped children.
- Avoid inline objects in `renderItem` — breaks memoization.
- Hoist callbacks to root of list component.
- Keep list items lightweight — no queries, minimal hooks, prefer Zustand selectors over Context.
- Pass stable references to lists — don't map/filter before passing `data`.
- Pass primitives (not objects) as props to list items for effective `memo()`.
- Request compressed, appropriately-sized images in lists.
- Use `getItemType` for heterogeneous lists (different layouts).

### 3. Animation (HIGH)
- Animate only `transform` and `opacity` — never `width`, `height`, `top`, `left`, `margin`.
- Use `useDerivedValue` (not `useAnimatedReaction`) for derived values.
- Use `GestureDetector` + `Gesture.Tap()` for animated press states (runs on UI thread).

### 4. Scroll Performance (HIGH)
- Never track scroll position in `useState` — use Reanimated shared value or `useRef`.

### 5. Navigation (HIGH)
- Use `@react-navigation/native-stack` (not `@react-navigation/stack`).
- Use `react-native-bottom-tabs` or expo-router native tabs (not `@react-navigation/bottom-tabs`).
- Use native header options — avoid custom header components.

### 6. React State (MEDIUM)
- Minimize state — derive values in render instead of storing them.
- Use `undefined` as initial state + `??` fallback instead of `initialState`.
- Use dispatch updater `setState(prev => ...)` when next state depends on current.

### 7. State Architecture (MEDIUM)
- State represents ground truth (e.g., `pressed: 0|1`), not visual output (e.g., `scale: 0.95`).
- Derive visual values from state with `interpolate`.

### 8. React Compiler (MEDIUM)
- Destructure functions from hooks at top of render: `const { push } = useRouter()`.
- Use `.get()` / `.set()` for Reanimated shared values (not `.value`).

### 9. User Interface (MEDIUM)
- Use `useLayoutEffect` + `onLayout` (with dispatch updater) for view measurements.
- Use `borderCurve: 'continuous'` with `borderRadius`.
- Use `gap` (not `margin`) for spacing between elements.
- Use `experimental_backgroundImage` for gradients; `boxShadow` string for shadows.
- Use `contentInset` (not `padding`) for dynamic ScrollView spacing.
- Use `contentInsetAdjustmentBehavior="automatic"` instead of `SafeAreaView`.
- Use `expo-image` for all images — not RN's `Image`.
- Use `@nandorojo/galeria` for image galleries/lightboxes.
- Use `zeego` for native context menus and dropdowns.
- Use native `<Modal presentationStyle="formSheet">` — not JS bottom sheets.
- Use `Pressable` — never `TouchableOpacity` or `TouchableHighlight`.

### 10. Design System (MEDIUM)
- Use compound components (`Button`, `ButtonText`, `ButtonIcon`) — not polymorphic children.

### 11. Monorepo (LOW)
- Install native dependencies in app directory for autolinking.
- Use single exact versions across all packages (`syncpack`).

### 12. Third-Party Dependencies (LOW)
- Re-export dependencies from design system folder — never import directly from packages.

### 13. JavaScript (LOW)
- Hoist `Intl.DateTimeFormat`, `Intl.NumberFormat` to module scope.

### 14. Fonts (LOW)
- Use `expo-font` config plugin — not `useFonts` or `Font.loadAsync`.
