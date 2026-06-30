import { Heart, RefreshCw, ShoppingBag, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fetchProducts } from '../../api/products'
import { useAppStore } from '../../store/appStore'
import { formatPrice } from '../../utils/format'
import styles from './CatalogItem.module.css'

type CatalogItemProps = {
	query: string
	onOpen: () => void
	onlyFavorites?: boolean
}

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
			<div className={styles.catalogItem}>
				{Array.from({ length: 4 }).map((_, index) => (
					<div
						className={`${styles.catalogItemAction} ${styles.catalogItemActionLoading}`}
						key={index}
					>
						<div className={styles.catalogItemImg} />
						<div className={`${styles.catalogItemSkeleton} ${styles.catalogItemSkeletonTitle}`} />
						<div className={styles.catalogItemSkeleton} />
						<div className={`${styles.catalogItemSkeleton} ${styles.catalogItemSkeletonPrice}`} />
					</div>
				))}
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.catalogState}>
				<Sparkles size={28} />
				<h3>Mahsulotlarni yuklab bo‘lmadi</h3>
				<p>{error}</p>
				<button className={styles.catalogStateRetry} type='button' onClick={load}>
					<RefreshCw size={18} />
					Qayta urinish
				</button>
			</div>
		)
	}

	if (filteredProducts.length === 0) {
		return (
			<div className={styles.catalogState}>
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
		<div className={styles.catalogItem}>
			{filteredProducts.map(product => {
				const isLiked = safeFavoriteIds.includes(product.id)

				const openProduct = () => {
					setSelectedProduct(product)
					onOpen()
				}

				return (
					<article
						className={styles.catalogItemAction}
						key={product.id}
						onClick={openProduct}
					>
						<div className={styles.catalogItemImg}>
							<div className={styles.catalogItemLabel}>Qo‘lda</div>

							<button
								className={`${styles.catalogItemLike} ${
									isLiked ? styles.catalogItemLikeActive : ''
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

							{!imgLoaded[product.id] && <div className={styles.catalogItemImgSkeleton} />}
							<img
								src={product.images?.[0] || ''}
								alt={product.title}
								onLoad={() => setImgLoaded(p => ({ ...p, [product.id]: true }))}
								className={imgLoaded[product.id] ? styles.imgVisible : styles.imgHidden}
							/>
						</div>

						<div className={styles.catalogItemBody}>
							<h3>{product.title}</h3>

							<p className={styles.catalogItemDescription}>{product.description}</p>

							<div className={styles.catalogItemPriceRow}>
								<p>{formatPrice(product.price)} UZS</p>
							</div>

							<div className={styles.catalogItemCta}>
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
