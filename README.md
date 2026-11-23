# bootstrap

A Bootstrap 5 rebuild of the Ewebot "Home 10" digital-marketing landing page.

- **Bootstrap 5.3.9** (latest stable, from getbootstrap.com) is in `vendor/bootstrap/`.
- Page: `index.html`, styles: `assets/css/style.css`, interactions: `assets/js/main.js`.
- Fonts: Montserrat, Nunito, Rubik (Google Fonts). Icons: Bootstrap Icons (CDN).

## Interactive parts

| Original | Rebuild |
|---|---|
| Sticky header, hover drop-downs, mega menu | Bootstrap navbar + dropdowns (open on hover at ≥1200px) |
| Burger drop-down menu (tablet/mobile) | Bootstrap collapse with nested collapses |
| `<` info side panel | Bootstrap offcanvas |
| Search overlay | Bootstrap fullscreen modal |
| Typed headline (Success / Services / Business) | Vanilla JS typewriter, same speeds |
| Animated counters and progress bars | IntersectionObserver |
| Case-study carousel (center mode, dots, drag) | Custom infinite slider |
| Testimonials slider | Bootstrap carousel with pill dots |
| Card hovers, scroll-in animations, floating shapes | CSS |
| Back to top | Fixed button |

## Run locally

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Images

The images in `assets/img/` come from the Ewebot theme demo and are covered by that theme's license.
Swap them for your own before publishing this site anywhere public.
