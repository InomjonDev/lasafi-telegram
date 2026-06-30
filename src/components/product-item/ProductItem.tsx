import {
	ArrowLeft,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Heart,
	MessageCircle,
	Minus,
	Plus,
	ShoppingBag,
	Sparkles,
	X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { formatPrice } from '../../utils/format'
import styles from './ProductItem.module.css'

type ProductItemProps = {
	goBack: () => void
	goOrder: () => void
}

export function ProductItem({ goBack, goOrder }: ProductItemProps) {
	const product = useAppStore(s => s.selectedProduct)
	const quantity = useAppStore(s => s.orderQuantity)
	const setOrderQuantity = useAppStore(s => s.setOrderQuantity)
	const favoriteIds = useAppStore(s => s.favoriteIds)
	const toggleFavorite = useAppStore(s => s.toggleFavorite)

	const [slideIndex, setSlideIndex] = useState(0)
	const swipeRef = useRef({ startX: 0, startY: 0, dx: 0 })
	const trackRef = useRef<HTMLDivElement>(null)

	const [lightboxOpen, setLightboxOpen] = useState(false)
	const [lightboxIndex, setLightboxIndex] = useState(0)

	useEffect(() => {
		if (!lightboxOpen) return
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setLightboxOpen(false)
			if (e.key === 'ArrowLeft') setLightboxIndex(i => Math.max(i - 1, 0))
			if (e.key === 'ArrowRight') setLightboxIndex(i => Math.min(i + 1, images.length - 1))
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	})

	if (!product) return null

	const images = product.images?.length ? product.images : ['']
	const isLiked = favoriteIds.includes(product.id)

	const goNext = useCallback(() => {
		setSlideIndex(i => Math.min(i + 1, images.length - 1))
	}, [images.length])

	const goPrev = useCallback(() => {
		setSlideIndex(i => Math.max(i - 1, 0))
	}, [])

	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		const t = e.touches[0]
		swipeRef.current = { startX: t.clientX, startY: t.clientY, dx: 0 }
	}, [])

	const handleTouchMove = useCallback((e: React.TouchEvent) => {
		const t = e.touches[0]
		swipeRef.current.dx = t.clientX - swipeRef.current.startX
	}, [])

	const handleTouchEnd = useCallback(() => {
		const { dx } = swipeRef.current
		if (Math.abs(dx) > 50) {
			dx > 0 ? goPrev() : goNext()
		}
	}, [goNext, goPrev])

	const openLightbox = (index: number) => {
		setLightboxIndex(index)
		setLightboxOpen(true)
	}

	return (
		<section className={styles.productItem}>
			<div className={styles.productItemMedia}>
				<button
					className={`icon-button ${styles.productItemBack}`}
					type='button'
					aria-label='Back to catalog'
					onClick={goBack}
				>
					<ArrowLeft size={22} />
				</button>
				<span className={styles.productItemBadge}>
					<Sparkles size={15} />
					Qo‘l mehnati
				</span>
				<button
					className={`icon-button ${styles.productItemLike} ${isLiked ? styles.productItemLikeActive : ''}`}
					type='button'
					aria-label={isLiked ? 'Unlike product' : 'Like product'}
					onClick={() => toggleFavorite(product.id)}
				>
					<Heart size={21} fill='currentColor' />
				</button>

				<div
					className={styles.productItemSlider}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
				>
					<div
						ref={trackRef}
						className={styles.productItemSliderTrack}
						style={{ '--slide-offset': `${-slideIndex * 100}%` } as React.CSSProperties}
					>
						{images.map((src, i) => (
							<div key={i} className={styles.productItemSlide}>
								{src ? (
									<img
										src={src}
										alt={`${product.title} ${i + 1}`}
										onClick={() => openLightbox(i)}
									/>
								) : (
									<div className={styles.productItemSlideEmpty} />
								)}
							</div>
						))}
					</div>

					{images.length > 1 && (
						<>
							<button
								className={`${styles.productItemArrow} ${styles.productItemArrowLeft}`}
								type='button'
								aria-label='Oldingi rasm'
								onClick={goPrev}
								disabled={slideIndex === 0}
							>
								<ChevronLeft size={28} />
							</button>
							<button
								className={`${styles.productItemArrow} ${styles.productItemArrowRight}`}
								type='button'
								aria-label='Keyingi rasm'
								onClick={goNext}
								disabled={slideIndex === images.length - 1}
							>
								<ChevronRight size={28} />
							</button>
							<div className={styles.productItemDots}>
								{images.map((_, i) => (
									<button
										key={i}
										className={`${styles.productItemDot} ${i === slideIndex ? styles.productItemDotActive : ''}`}
										onClick={() => setSlideIndex(i)}
										aria-label={`Rasm ${i + 1}`}
									/>
								))}
							</div>
						</>
					)}
				</div>
			</div>

			{images.length > 1 && (
				<div className={styles.productItemThumbs}>
					{images.map((src, i) => (
						<button
							key={i}
							className={`${styles.productItemThumb} ${i === slideIndex ? styles.productItemThumbActive : ''}`}
							onClick={() => setSlideIndex(i)}
							type='button'
							aria-label={`Rasm ${i + 1}`}
						>
							{src ? (
								<img src={src} alt={`${product.title} ${i + 1}`} />
							) : (
								<div className={styles.productItemThumbEmpty} />
							)}
						</button>
					))}
				</div>
			)}

			<div className={styles.productItemContent}>
				<div className={styles.productItemHeading}>
					<p>Diadem store</p>
					<h1>{product.title}</h1>
				</div>

				<div className={styles.productItemPrice}>
					{formatPrice(product.price)} UZS
				</div>
				<p className={styles.productItemDescription}>{product.description}</p>

				<div className={styles.productItemNotes}>
					<div>
						<CheckCircle2 size={19} />
						<span>
							Buyurtma ma’lumotlari to‘g‘ridan-to‘g‘ri sotuvchiga yuboriladi
						</span>
					</div>
					<div>
						<MessageCircle size={19} />
						<span>
							Buyurtma ma’lumotlari to‘g‘ridan-to‘g‘ri sotuvchiga yuboriladi
						</span>
					</div>
				</div>
			</div>

			<div className={styles.productItemBar}>
				<div className={styles.quantityControl} aria-label='Quantity'>
					<button
						type='button'
						aria-label='Decrease quantity'
						onClick={() => setOrderQuantity(quantity - 1)}
					>
						<Minus size={17} />
					</button>
					<span>{quantity}</span>
					<button
						type='button'
						aria-label='Increase quantity'
						onClick={() => setOrderQuantity(quantity + 1)}
					>
						<Plus size={17} />
					</button>
				</div>
				<button className='primary-button' type='button' onClick={goOrder}>
					<ShoppingBag size={19} />
					Buyurtma berish
				</button>
			</div>

			{lightboxOpen && (
				<div
					className={styles.lightboxOverlay}
					onClick={() => setLightboxOpen(false)}
				>
					<button
						className={styles.lightboxClose}
						onClick={() => setLightboxOpen(false)}
						aria-label='Close lightbox'
					>
						<X size={28} />
					</button>
					{images.length > 1 && (
						<button
							className={styles.lightboxPrev}
							onClick={e => { e.stopPropagation(); setLightboxIndex(i => Math.max(i - 1, 0)) }}
							disabled={lightboxIndex === 0}
							aria-label='Previous image'
						>
							<ChevronLeft size={28} />
						</button>
					)}
					<div
						className={styles.lightboxContent}
						onClick={e => e.stopPropagation()}
					>
						<img
							className={styles.lightboxImg}
							src={images[lightboxIndex]}
							alt={`${product.title} ${lightboxIndex + 1}`}
						/>
					</div>
					{images.length > 1 && (
						<button
							className={styles.lightboxNext}
							onClick={e => { e.stopPropagation(); setLightboxIndex(i => Math.min(i + 1, images.length - 1)) }}
							disabled={lightboxIndex === images.length - 1}
							aria-label='Next image'
						>
							<ChevronRight size={28} />
						</button>
					)}
					{images.length > 1 && (
						<div className={styles.lightboxDots}>
							{images.map((_, i) => (
								<button
									key={i}
									className={`${styles.lightboxDot} ${i === lightboxIndex ? styles.lightboxDotActive : ''}`}
									onClick={() => setLightboxIndex(i)}
									aria-label={`Image ${i + 1}`}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</section>
	)
}
