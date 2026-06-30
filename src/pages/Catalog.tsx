import { Crown, Heart, RefreshCw, Search, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { CatalogItem } from '../components/catalog-item/CatalogItem'
import { useAppStore } from '../store/appStore'
import { fetchProducts } from '../api/products'
import styles from './Catalog.module.css'

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
		<div className={styles.catalog}>
			<section className={styles.catalogShell}>
		<header className={styles.catalogHero}>
				<div className={styles.catalogHeroTop}>
					<div>
						<p className={styles.eyebrow}>
							<Sparkles size={15} />
							Telegram boutique
						</p>
						<h1>LaSafi Diadems</h1>
						<p className={styles.catalogHeroCopy}>
							Nafis diademlar va qo‘lda tayyorlangan kelinlar uchun
							aksessuarlar.
						</p>
					</div>
					<div className={styles.brandMark} aria-hidden='true'>
						<Crown size={30} strokeWidth={1.9} />
					</div>
				</div>

				<div className={styles.searchRow}>
					<label className={styles.catalogSearch}>
						<Search size={21} />
						<input
							type='search'
							value={query}
							placeholder='Mahsulotlarni qidiring...'
							onChange={event => setQuery(event.target.value)}
						/>
					</label>
					<button
						className={`${styles.brandMark} ${styles.favoriresBtn}`}
						onClick={handleRefresh}
						aria-label='Refresh'
					>
						<RefreshCw size={22} className={refreshing ? styles.spin : ''} />
					</button>
					<button
						className={`${styles.brandMark} ${styles.favoriresBtn}`}
						onClick={goFavorites}
						aria-label='Favorites'
					>
						<Heart size={24} fill='currentColor' />
					</button>
				</div>
			</header>

				<div className={styles.sectionHeading}>
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
