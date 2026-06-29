import {
	ArrowLeft,
	CheckCircle2,
	Heart,
	MessageCircle,
	Minus,
	Plus,
	ShoppingBag,
	Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import './ProductItem.css'

type ProductItemProps = {
	goBack: () => void
	goOrder: () => void
}

const formatPrice = (price: number) =>
	new Intl.NumberFormat('uz-UZ').format(price)

export function ProductItem({ goBack, goOrder }: ProductItemProps) {
	const product = useAppStore(s => s.selectedProduct)
	const quantity = useAppStore(s => s.orderQuantity)
	const setOrderQuantity = useAppStore(s => s.setOrderQuantity)
	const favoriteIds = useAppStore(s => s.favoriteIds)
	const toggleFavorite = useAppStore(s => s.toggleFavorite)

	const [slideIndex, setSlideIndex] = useState(0)

	if (!product) return null

	const images = product.images?.length ? product.images : ['']
	const isLiked = favoriteIds.includes(product.id)

	return (
		<section className='product_item'>
			<div className='product_item-media'>
				<button
					className='icon-button product_item-back'
					type='button'
					aria-label='Back to catalog'
					onClick={goBack}
				>
					<ArrowLeft size={22} />
				</button>
				<span className='product_item-badge'>
					<Sparkles size={15} />
					Qo‘l mehnati
				</span>
				<button
					className={`icon-button product_item-like ${isLiked ? 'product_item-like--active' : ''}`}
					type='button'
					aria-label={isLiked ? 'Unlike product' : 'Like product'}
					onClick={() => toggleFavorite(product.id)}
				>
					<Heart size={21} fill='currentColor' />
				</button>

				<div className='product_item-slider'>
					<div
						className='product_item-slider-track'
						style={{ transform: `translateX(-${slideIndex * 100}%)` }}
					>
						{images.map((src, i) => (
							<div key={i} className='product_item-slide'>
								{src ? (
									<img src={src} alt={`${product.title} ${i + 1}`} />
								) : (
									<div className='product_item-slide-empty' />
								)}
							</div>
						))}
					</div>

					{images.length > 1 && (
						<div className='product_item-dots'>
							{images.map((_, i) => (
								<button
									key={i}
									className={`product_item-dot ${i === slideIndex ? 'product_item-dot--active' : ''}`}
									onClick={() => setSlideIndex(i)}
									aria-label={`Rasm ${i + 1}`}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			<div className='product_item-content'>
				<div className='product_item-heading'>
					<p>Diadem store</p>
					<h1>{product.title}</h1>
				</div>

				<div className='product_item-price'>
					{formatPrice(product.price)} UZS
				</div>
				<p className='product_item-description'>{product.description}</p>

				<div className='product_item-notes'>
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

			<div className='product_item-bar'>
				<div className='quantity-control' aria-label='Quantity'>
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
		</section>
	)
}
