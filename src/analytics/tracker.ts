const VISITOR_KEY = 'lasafi-visitor-id'
const API_BASE = 'https://telegram-shop-api.inomjonismanaliev.workers.dev'

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

function track(event_type: string, page?: string, product_id?: string) {
  try {
    const payload = {
      event_type,
      page,
      product_id: product_id || null,
      referrer: document.referrer || null,
      visitor_id: getVisitorId(),
    }
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${API_BASE}/analytics/track`, JSON.stringify(payload))
    } else {
      fetch(`${API_BASE}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    // silently fail - analytics should never break the app
  }
}

export function trackVisit() {
  track('visit')
}

export function trackPageView(page: string) {
  track('page_view', page)
}

export function trackProductView(productId: string) {
  track('product_view', 'product', productId)
}
