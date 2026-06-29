import { create } from 'zustand'

export type Product = {
	id: string
	title: string
	price: number
	images: string[]
	description: string
}

const FAVORITES_KEY = 'lasafi-liked-products'

const readFavoriteIds = () => {
	try {
		return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]') as string[]
	} catch {
		return []
	}
}

type State = {
	products: Product[]
	selectedProduct: Product | null
	orderQuantity: number
	favoriteIds: string[]
	setProducts: (p: Product[]) => void
	setSelectedProduct: (p: Product) => void
	setOrderQuantity: (quantity: number) => void
	toggleFavorite: (id: string) => void
}

export const useAppStore = create<State>((set, get) => ({
	products: [],
	selectedProduct: null,
	orderQuantity: 1,
	favoriteIds: readFavoriteIds(),
	setProducts: p => set({ products: p }),
	setSelectedProduct: p => set({ selectedProduct: p, orderQuantity: 1 }),
	setOrderQuantity: quantity =>
		set({ orderQuantity: Math.max(1, Math.min(20, quantity)) }),
	toggleFavorite: id => {
		const current = get().favoriteIds
		const next = current.includes(id)
			? current.filter(i => i !== id)
			: [...current, id]
		set({ favoriteIds: next })
		localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
	},
}))
