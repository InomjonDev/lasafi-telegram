import { Heart, ShoppingBag, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fetchProducts } from '../../api/products'
import { type Product, useAppStore } from '../../store/appStore'
import './CatalogItem.css'

type CatalogItemProps = {
	query: string
	onOpen: () => void
	onlyFavorites?: boolean
}

const formatPrice = (price: number) =>
	new Intl.NumberFormat('uz-UZ').format(price)

export function CatalogItem({
	query,
	onOpen,
	onlyFavorites,
}: CatalogItemProps) {
	const {
		products,
		setProducts,
		setSelectedProduct,
		favoriteIds,
		toggleFavorite,
	} = useAppStore()

	const safeProducts = products ?? []
	const safeFavoriteIds = favoriteIds ?? []

	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (safeProducts.length > 0) return

		setIsLoading(true)

		fetchProducts()
			.then((data: Product[]) => {
				setProducts(data ?? [])
				setError('')
			})
			.catch(() => {
				setError('Products are unavailable right now.')
			})
			.finally(() => setIsLoading(false))
	}, [safeProducts.length, setProducts])

	const filteredProducts = useMemo(() => {
		let list = safeProducts

		if (onlyFavorites) {
			list = list.filter(p => safeFavoriteIds.includes(p.id))
		}

		const search = query.trim().toLowerCase()

		if (!search) return list

		return list.filter(product => {
			const title = product.title?.toLowerCase() ?? ''
			const description = product.description?.toLowerCase() ?? ''

			return title.includes(search) || description.includes(search)
		})
	}, [safeProducts, query, onlyFavorites, safeFavoriteIds])

	if (isLoading) {
		return (
			<div className='catalog_item'>
				{Array.from({ length: 4 }).map((_, index) => (
					<div
						className='catalog_item-action catalog_item-action--loading'
						key={index}
					>
						<div className='catalog_item-img' />
						<div className='catalog_item-skeleton catalog_item-skeleton--title' />
						<div className='catalog_item-skeleton' />
						<div className='catalog_item-skeleton catalog_item-skeleton--price' />
					</div>
				))}
			</div>
		)
	}

	if (error) {
		return (
			<div className='catalog-state'>
				<Sparkles size={28} />
				<h3>{error}</h3>
				<p>Please check the store server and try again.</p>
			</div>
		)
	}

	if (filteredProducts.length === 0) {
		return (
			<div className='catalog-state'>
				<Sparkles size={28} />
				<h3>{onlyFavorites ? 'No favorites yet' : 'No pieces found'}</h3>
				<p>
					{onlyFavorites
						? 'Explore the catalog and tap the heart icon to save items.'
						: 'Try a different search term.'}
				</p>
			</div>
		)
	}

	return (
		<div className='catalog_item'>
			{filteredProducts.map(product => {
				const isLiked = safeFavoriteIds.includes(product.id)

				const openProduct = () => {
					setSelectedProduct(product)
					onOpen()
				}

				return (
					<article
						className='catalog_item-action'
						key={product.id}
						onClick={openProduct}
					>
						<div className='catalog_item-img'>
							<div className='catalog_item-label'>Qo‘lda</div>

							<button
								className={`catalog_item-like ${
									isLiked ? 'catalog_item-like--active' : ''
								}`}
								type='button'
								aria-label={
									isLiked ? `Unlike ${product.title}` : `Like ${product.title}`
								}
								onClick={event => {
									event.stopPropagation()
									toggleFavorite(product.id)
								}}
							>
								<Heart size={21} strokeWidth={2.1} fill='currentColor' />
							</button>

							<img src={product.images?.[0] || ''} alt={product.title} />
						</div>

						<div className='catalog_item-body'>
							<h3>{product.title}</h3>

							<p className='catalog_item-description'>{product.description}</p>

							<div className='catalog_item-price-row'>
								<p>{formatPrice(product.price)} UZS</p>
							</div>

							<div className='catalog_item-cta'>
								<ShoppingBag size={17} strokeWidth={2.2} />
								<span>Mahsulotni ko‘rish</span>
							</div>
						</div>
					</article>
				)
			})}
		</div>
	)
}
