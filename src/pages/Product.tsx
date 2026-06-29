import { ProductItem } from '../components/product-item/ProductItem'
import { useAppStore } from '../store/appStore'
import './page-styles.css'

type ProductProps = {
	goBack: () => void
	goOrder: () => void
}

export default function Product({ goBack, goOrder }: ProductProps) {
	const product = useAppStore(s => s.selectedProduct)

	if (!product) return null

	return (
		<div className='products'>
			<ProductItem goBack={goBack} goOrder={goOrder} />
		</div>
	)
}
