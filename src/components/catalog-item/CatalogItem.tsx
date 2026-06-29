import { Heart, RefreshCw, ShoppingBag, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fetchProducts } from '../../api/products'
import { useAppStore } from '../../store/appStore'
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
	const [imgLoaded, setImgLoaded] = useState<Record<string, boolean>>({})

	const load = async () => {
		setIsLoading(true)
		setError('')
		try {
			const data = await fetchProducts()
			setProducts(data ?? [])
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Server bilan bog‘lanib bo‘lmadi')
		}
		setIsLoading(false)
	}

	useEffect(() => {
		if (safeProducts.length > 0) return
		load()
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
				<h3>Mahsulotlarni yuklab bo‘lmadi</h3>
				<p>{error}</p>
				<button className='catalog-state__retry' type='button' onClick={load}>
					<RefreshCw size={18} />
					Qayta urinish
				</button>
			</div>
		)
	}

	if (filteredProducts.length === 0) {
		return (
			<div className='catalog-state'>
				<Sparkles size={28} />
				<h3>{onlyFavorites ? 'Sevimlilar yo‘q' : 'Mahsulot topilmadi'}</h3>
				<p>
					{onlyFavorites
						? 'Katalogni ko‘rib chiqing va yoqtirgan mahsulotlarni saqlang.'
						: 'Boshqa qidiruv so‘zini kiriting.'}
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

							{!imgLoaded[product.id] && <div className='catalog_item-img-skeleton' />}
							<img
								src={product.images?.[0] || ''}
								alt={product.title}
								onLoad={() => setImgLoaded(p => ({ ...p, [product.id]: true }))}
								style={{ display: imgLoaded[product.id] ? 'block' : 'none' }}
							/>
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
