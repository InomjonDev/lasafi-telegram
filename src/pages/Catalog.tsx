import { Crown, Heart, RefreshCw, Search, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { CatalogItem } from '../components/catalog-item/CatalogItem'
import { useAppStore } from '../store/appStore'
import { fetchProducts } from '../api/products'
import './page-styles.css'

type CatalogProps = {
	onOpen: () => void
	goFavorites: () => void
}

export default function Catalog({ onOpen, goFavorites }: CatalogProps) {
	const setProducts = useAppStore(s => s.setProducts)
	const [refreshing, setRefreshing] = useState(false)

	const handleRefresh = async () => {
		setRefreshing(true)
		try {
			const data = await fetchProducts()
			setProducts(data ?? [])
		} catch {
			// error handled inside CatalogItem
		}
		setRefreshing(false)
	}
	const [query, setQuery] = useState('')

	return (
		<div className='catalog'>
			<section className='catalog-shell'>
		<header className='catalog-hero'>
				<div className='catalog-hero__top'>
					<div>
						<p className='eyebrow'>
							<Sparkles size={15} />
							Telegram boutique
						</p>
						<h1>LaSafi Diadems</h1>
						<p className='catalog-hero__copy'>
							Nafis diademlar va qo‘lda tayyorlangan kelinlar uchun
							aksessuarlar.
						</p>
					</div>
					<div className='brand-mark' aria-hidden='true'>
						<Crown size={30} strokeWidth={1.9} />
					</div>
				</div>

				<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
					<label className='catalog-search' style={{ flex: 1 }}>
						<Search size={21} />
						<input
							type='search'
							value={query}
							placeholder='Mahsulotlarni qidiring...'
							onChange={event => setQuery(event.target.value)}
						/>
					</label>
					<button
						className='brand-mark favorires-btn'
						onClick={handleRefresh}
						aria-label='Refresh'
						style={{ opacity: refreshing ? 0.5 : 1 }}
					>
						<RefreshCw size={22} className={refreshing ? 'spin' : ''} />
					</button>
					<button
						className='brand-mark favorires-btn'
						onClick={goFavorites}
						aria-label='Favorites'
					>
						<Heart size={24} fill='currentColor' />
					</button>
				</div>
			</header>

				<div className='section-heading'>
					<div>
						<p>Kolleksiya</p>
						<h2>Sotuvdagi mahsulotlar</h2>
					</div>
				</div>

				<CatalogItem query={query} onOpen={onOpen} />
			</section>
		</div>
	)
}
