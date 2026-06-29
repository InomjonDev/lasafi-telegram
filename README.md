# LaSafi Diadems — Telegram Mini App

A seller-based e-commerce Telegram Mini App for LaSafi Diadems, a boutique selling handmade tiaras and bridal accessories in Uzbekistan. Customers browse products, save favorites, and submit orders — the seller receives the request and follows up via Telegram.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Bundler | Vite 8 |
| State | Zustand 5 |
| UI Icons | lucide-react |
| HTTP | Axios (+ native fetch) |
| Telegram SDK | @twa-dev/sdk |
| Compiler | React Compiler (babel plugin) |

## Architecture

```
src/
  api/           — HTTP client (products, orders)
  components/
    catalog-item/ — Product card grid + loading skeleton
    product-item/ — Single product detail view
  pages/
    Catalog.tsx   — Product listing + search
    Product.tsx   — Product detail + quantity selector
    Order.tsx     — Checkout form (phone, address)
    Favorites.tsx — Saved products filtered view
  store/
    appStore.ts   — Zustand store (products, selection, favorites)
  App.tsx         — Manual page routing via useState
```

Pages are managed with a simple `useState`-based router in `App.tsx`, not a library.

## Setup

```bash
bun install      # or npm install / yarn
bun run dev      # Vite dev server
bun run build    # tsc + vite build
bun run lint     # ESLint
```

Set the API base URL in `src/api/products.ts` (currently hardcoded) or migrate to `VITE_API_BASE_URL`.

## Features

- Product catalog with live search filtering
- Product detail with quantity selector (1–20)
- Favorites — persisted in localStorage
- Order form with Uzbek phone number formatting
- Skeleton loading states and empty-state fallbacks
- Responsive design (mobile-first breakpoints)

## How Orders Work

1. Customer selects a product and quantity
2. Fills in phone (+998 format) and delivery address
3. Order is POSTed to the backend API
4. Customer sees a success confirmation
5. Seller contacts the customer via Telegram to arrange payment and delivery

## Review Notes

Key items flagged during review:

- `CatalogItem` destructures the entire Zustand store — causes unnecessary re-renders on any state change (e.g. `orderQuantity`). Use individual selectors like `ProductItem` does.
- Order submission has no error handling — if the API call throws, the button gets stuck in a disabled/"Sending..." state. Wrap `createOrder` in try/catch.
- `createOrder` accepts `data: any` — should be properly typed.
- API base URL is hardcoded — move to `VITE_` env variable.
- Some components use `any` for callback props instead of typed function signatures.
- Two notes in `ProductItem` have duplicate text — likely a copy-paste bug.
- Image tags lack `loading="lazy"`.
- No tests configured.
