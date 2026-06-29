import { ChevronLeft, Heart } from 'lucide-react'
import { CatalogItem } from '../components/catalog-item/CatalogItem'
import { useAppStore } from '../store/appStore'
import './page-styles.css'

type FavoritesProps = {
	goBack: () => void
	onOpenProduct: () => void
}

export default function Favorites({ goBack, onOpenProduct }: FavoritesProps) {
	const favoriteIds = useAppStore(s => s.favoriteIds)

	return (
		<div className='catalog'>
			<section className='catalog-shell'>
				<header className='catalog-hero'>
					<button
						className='order-back'
						onClick={goBack}
						style={{ marginBottom: '12px' }}
					>
						<ChevronLeft size={20} />
						Katalogga qaytish
					</button>
					<div className='catalog-hero__top'>
						<div>
							{/* <p className='eyebrow'>
								<Heart size={15} fill='currentColor' />
								Sevimli mahsulotlaringiz
							</p> */}
							<h1>Sevimlilar</h1>
							{/* <p className='catalog-hero__copy'>
								Yoqtirgan mahsulotlaringiz shu yerda jamlanadi.
							</p> */}
						</div>
						<div className='brand-mark' aria-hidden='true'>
							<Heart size={30} strokeWidth={1.9} fill='currentColor' />
						</div>
					</div>
				</header>

				<div className='section-heading'>
					<div>
						<p>Saqlangan</p>
						{/* <h2>Sevimli mahsulotlar</h2> */}
					</div>
					<span>{favoriteIds.length} items</span>
				</div>

				<CatalogItem query='' onOpen={onOpenProduct} onlyFavorites={true} />
			</section>
		</div>
	)
}
