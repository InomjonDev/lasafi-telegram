import WebApp from '@twa-dev/sdk'
import {
	ArrowLeft,
	CheckCircle2,
	MapPin,
	Phone,
	Send,
	ShoppingBag,
} from 'lucide-react'
import { useState } from 'react'
import { createOrder } from '../api/products'
import { useAppStore } from '../store/appStore'
import './page-styles.css'

type OrderProps = {
	goBack: () => void
	goCatalog: () => void
}

const formatPrice = (price: number) =>
	new Intl.NumberFormat('uz-UZ').format(price)

export default function Order({ goBack, goCatalog }: OrderProps) {
	const product = useAppStore(s => s.selectedProduct)
	const quantity = useAppStore(s => s.orderQuantity)
	const user = WebApp.initDataUnsafe?.user
	const [phone, setPhone] = useState('')
	const [address, setAddress] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSent, setIsSent] = useState(false)
	const phoneDigits = phone.replace(/\D/g, '')
	const isPhoneValid =
		phoneDigits.length === 12 && phoneDigits.startsWith('998')

	const formatUzbekPhone = (value: string) => {
		const digits = value.replace(/\D/g, '')
		if (!digits) return ''

		const localDigits = (
			digits.startsWith('998') ? digits.slice(3) : digits
		).slice(0, 9)
		let formatted = '+998'

		if (localDigits.length > 0) formatted += ` ${localDigits.slice(0, 2)}`
		if (localDigits.length > 2) formatted += ` ${localDigits.slice(2, 5)}`
		if (localDigits.length > 5) formatted += ` ${localDigits.slice(5, 7)}`
		if (localDigits.length > 7) formatted += ` ${localDigits.slice(7, 9)}`

		return formatted
	}

	const submit = async () => {
		if (!product || isSubmitting || !isPhoneValid || !address.trim()) return

		setIsSubmitting(true)

		await createOrder({
			product_id: product.id,
			product_title: product.title,
			product_image: product.images?.[0] || '',
			price: product.price,
			quantity,
			total_price: product.price * quantity,
			customer_name: user?.first_name || 'User',
			phone,
			address,
		})

		setIsSubmitting(false)
		setIsSent(true)
	}

	if (!product) return null

	if (isSent) {
		return (
			<main className='order-page'>
				<section className='order-success'>
					<div>
						<CheckCircle2 size={44} />
					</div>
					<h1>Buyurtma yuborildi</h1>
					<p>
						Sotuvchi sizning so‘rovingizni oldi va Telegram orqali siz bilan
						bog‘lanadi.
					</p>
					<button className='primary-button' type='button' onClick={goCatalog}>
						Bosh sahifaga qaytish
					</button>
				</section>
			</main>
		)
	}

	return (
		<main className='order-page'>
			<section className='order-card'>
				<button className='order-back' type='button' onClick={goBack}>
					<ArrowLeft size={20} />
					Product
				</button>

				<div className='order-card__product'>
					<img src={product.images?.[0] || ''} alt={product.title} />
					<div>
						<p>Buyurtma berish</p>
						<h1>{product.title}</h1>
						<span>
							{quantity} x {formatPrice(product.price)} UZS
						</span>
						<strong>Total: {formatPrice(product.price * quantity)} UZS</strong>
					</div>
				</div>

				<div className='order-form'>
					<label>
						<span>Telefon raqami</span>
						<div className='input-shell'>
							<Phone size={19} />
							<input
								value={phone}
								inputMode='tel'
								placeholder='+998 90 123 45 67'
								onChange={event =>
									setPhone(formatUzbekPhone(event.target.value))
								}
							/>
						</div>
					</label>

					<label>
						<span>Yetkazib berish manzili</span>
						<div className='input-shell input-shell--textarea'>
							<MapPin size={19} />
							<textarea
								value={address}
								placeholder='Shahar, ko‘cha'
								onChange={event => setAddress(event.target.value)}
							/>
						</div>
					</label>
				</div>

				<button
					className='primary-button order-submit'
					type='button'
					disabled={isSubmitting || !isPhoneValid || !address.trim()}
					onClick={submit}
				>
					{isSubmitting ? (
						'Sending...'
					) : (
						<>
							<Send size={18} />
							Buyurtma yuborish
						</>
					)}
				</button>

				<div className='order-note'>
					<ShoppingBag size={18} />
					<span>
						So‘rovingiz sotuvchiga yuboriladi. To‘lov va yetkazib berish
						Telegram orqali kelishiladi.
					</span>
				</div>
			</section>
		</main>
	)
}
