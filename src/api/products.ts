const baseURL = 'https://telegram-shop-api.inomjonismanaliev.workers.dev'

export async function fetchProducts() {
	const res = await fetch(`${baseURL}/products`)
	return res.json()
}

export async function createOrder(data: any) {
	const res = await fetch(`${baseURL}/order`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	return res.json()
}
