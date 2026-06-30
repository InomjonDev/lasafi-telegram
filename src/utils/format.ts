export const formatPrice = (price: number) =>
	new Intl.NumberFormat('uz-UZ').format(price)
