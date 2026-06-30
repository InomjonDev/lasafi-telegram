import { useEffect } from 'react'
import { ProductItem } from '../components/product-item/ProductItem'
import { useAppStore } from '../store/appStore'
import { trackProductView } from '../analytics/tracker'
import styles from './Product.module.css'

type ProductProps = {
	goBack: () => void
	goOrder: () => void
}

export default function Product({ goBack, goOrder }: ProductProps) {
	const product = useAppStore(s => s.selectedProduct)

	useEffect(() => {
		if (product) trackProductView(product.id)
	}, [product])

	if (!product) return null

	return (
		<div className={styles.wrapper}>
			<ProductItem goBack={goBack} goOrder={goOrder} />
		</div>
	)
}
