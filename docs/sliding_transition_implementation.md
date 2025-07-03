# Sliding Page Transition Implementation

## Overview
Added smooth sliding transitions between the homepage and settings page using a custom `PageTransition` component that integrates with Next.js routing.

## Implementation Details

### 1. PageTransition Component (`src/components/Layout/PageTransition.tsx`)

**Key Features:**
- Automatic direction detection (forward/backward) based on page hierarchy
- Smooth CSS-based animations using `transform: translateX()`
- Performance optimizations with hardware acceleration
- Proper cleanup to prevent memory leaks

**How it works:**
- Tracks pathname changes using Next.js `usePathname()` hook
- Determines slide direction based on page levels (/ = 0, /settings = 1)
- Forward navigation: slides in from right
- Backward navigation: slides in from left
- 300ms cubic-bezier animation for smooth transitions

### 2. Integration with PageLayout

The `PageTransition` component is integrated into the existing `PageLayout` component, wrapping all page content:

```tsx
<PageLayout>
  <PageTransition>
    {children} // Homepage or Settings content
  </PageTransition>
</PageLayout>
```

### 3. Animation Styles

**CSS Animations:**
- `slideInFromRight`: For forward navigation (home → settings)
- `slideInFromLeft`: For backward navigation (settings → home)
- Hardware acceleration: `transform`, `backface-visibility`, `will-change`
- Proper overflow handling to prevent visual glitches

### 4. Navigation Flow

**Forward (Home → Settings):**
1. User clicks settings button (⚙️) in PomodoroTimer
2. `router.push('/settings')` is called
3. PageTransition detects level change (0 → 1)
4. Settings page slides in from right
5. Animation completes in 300ms

**Backward (Settings → Home):**
1. User clicks back button (←) in SettingsHeader
2. `router.push('/')` is called  
3. PageTransition detects level change (1 → 0)
4. Homepage slides in from left
5. Animation completes in 300ms

## Browser Compatibility

- Modern browsers with CSS transform support
- Fallback: instant transition if animations not supported
- Mobile-friendly touch interactions

## Performance Considerations

- Uses CSS transforms (GPU accelerated)
- Minimal JavaScript overhead
- No external animation libraries required
- Cleanup prevents memory leaks

## Testing

Comprehensive test suite covers:
- Basic rendering functionality
- Navigation simulation 
- CSS class structure
- Error handling
- Component lifecycle
- Rapid navigation scenarios

Run tests: `npm test -- PageTransition.test.tsx`

## Usage

The sliding transitions are automatically applied to all navigation between:
- `/` (Homepage with PomodoroTimer)
- `/settings` (Settings page with configuration options)

No additional configuration required - the transitions work seamlessly with existing Next.js routing. 