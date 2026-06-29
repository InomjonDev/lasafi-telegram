import type { Product } from '../store/appStore'

const baseURL = 'https://telegram-shop-api.inomjonismanaliev.workers.dev'

export async function fetchProducts(): Promise<Product[]> {
	const res = await fetch(`${baseURL}/products`)
	if (!res.ok) {
		const body = await res.json().catch(() => null)
		throw new Error(body?.error || `Server xatosi (${res.status})`)
	}
	const data = await res.json()
	return data ?? []
}

export async function createOrder(data: Record<string, unknown>) {
	const res = await fetch(`${baseURL}/order`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})
	if (!res.ok) {
		const body = await res.json().catch(() => null)
		throw new Error(body?.error || `Server xatosi (${res.status})`)
	}
	return res.json()
}
