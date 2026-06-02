# Home GSAP Section Slider Design

## Goal

Turn the home page into a GSAP Observer-driven full-screen section story, matching the section-to-section animation feel from the user's CodePen example.

## Scope

- Applies only to the home page rendered by `components/Experience.tsx`.
- Uses the existing home sections: `#home`, `#stack`, `#operations`, `#proof`, and `#contact`.
- Keeps the existing navbar, custom cursor, 3D globe/model layers, section content, and interactive modals.
- Keeps the footer reachable after the final story section.
- Honors `prefers-reduced-motion: reduce` with the current native scroll behavior.

## Behavior

On ordinary desktop/mobile motion settings, the home page story locks the main sections into fixed full-screen panels. Wheel, touch, and pointer scroll gestures move one section at a time. The entering section animates in from the scroll direction, while the outgoing section shifts and fades behind it. Section headings/content reveal during entry.

When the visitor reaches the final story section, one more downward scroll releases the page to the footer. Scrolling upward from the footer re-enters the story at the contact section. Navigation anchor clicks jump to the matching section using the same story state when possible.

## Architecture

- Add a small pure helper module for story index/release decisions so the edge behavior is testable without a browser.
- Add a React client component that initializes the GSAP Observer lifecycle on the home page and cleans it up on unmount.
- Mark each home section with story metadata and a stable inner wrapper so GSAP has predictable animation targets.
- Add CSS for the active story mode while preserving the existing native layout as the fallback.

## Testing

- Unit-test the pure navigation helper with Node's built-in test runner.
- Run `npm run build` for TypeScript and production compatibility.
- Run the local Next dev server and verify section-to-section scrolling in the in-app browser on desktop and a mobile viewport.

