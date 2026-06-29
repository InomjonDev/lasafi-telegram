import { useState } from 'react'
import Catalog from './pages/Catalog'
import Favorites from './pages/Favorites'
import Order from './pages/Order'
import Product from './pages/Product'
import { useAppStore } from './store/appStore'

export default function App() {
	const selected = useAppStore(s => s.selectedProduct)
	const [page, setPage] = useState<
		'catalog' | 'product' | 'order' | 'favorites'
	>('catalog')

	if (page === 'product' && selected) {
		return (
			<Product
				goBack={() => setPage('catalog')}
				goOrder={() => setPage('order')}
			/>
		)
	}

	if (page === 'order' && selected) {
		return (
			<Order
				goBack={() => setPage('product')}
				goCatalog={() => setPage('catalog')}
			/>
		)
	}

	if (page === 'favorites') {
		return (
			<Favorites
				goBack={() => setPage('catalog')}
				onOpenProduct={() => setPage('product')}
			/>
		)
	}

	return (
		<Catalog
			onOpen={() => setPage('product')}
			goFavorites={() => setPage('favorites')}
		/>
	)
}
