import { ChevronLeft, Heart } from 'lucide-react'
import { CatalogItem } from '../components/catalog-item/CatalogItem'
import { useAppStore } from '../store/appStore'
import styles from './Favorites.module.css'

type FavoritesProps = {
	goBack: () => void
	onOpenProduct: () => void
}

export default function Favorites({ goBack, onOpenProduct }: FavoritesProps) {
	const favoriteIds = useAppStore(s => s.favoriteIds)

	return (
		<div className={styles.catalog}>
			<section className={styles.catalogShell}>
		<header className={styles.catalogHero}>
				<button
					className={styles.orderBack}
					onClick={goBack}
				>
					<ChevronLeft size={20} />
					Katalogga qaytish
				</button>
				<div className={styles.catalogHeroTop}>
					<div>
						<h1>Sevimlilar</h1>
					</div>
					<div className={styles.brandMark} aria-hidden='true'>
						<Heart size={30} strokeWidth={1.9} fill='currentColor' />
					</div>
				</div>
			</header>

			<div className={styles.sectionHeading}>
				<div>
					<p>Saqlangan</p>
				</div>
				<span>{favoriteIds.length} items</span>
			</div>

				<CatalogItem query='' onOpen={onOpenProduct} onlyFavorites={true} />
			</section>
		</div>
	)
}
