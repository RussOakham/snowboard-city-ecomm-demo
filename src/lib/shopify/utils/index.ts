import { HIDDEN_PRODUCT_TAG } from '../constants'
import { Product, ShopifyProduct } from '../types/product'
import { Connection, Image } from '../types/shopify'

export const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
	return array.edges.map((edge) => edge?.node)
}

export const reshapeImages = (
	images: Connection<Image>,
	productTitle: string,
) => {
	const flattened = removeEdgesAndNodes(images)

	return flattened.map((image) => {
		const match = image.url.match(/.*\/(.*)\..*/)
		const filename = match ? match[1] : 'default'
		return {
			...image,
			altText: image.altText || `${productTitle} - ${filename}`,
		}
	})
}

export const reshapeProduct = (
	product: ShopifyProduct,
	filterHiddenProducts: boolean = true,
) => {
	if (
		!product ||
		(filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
	)
		return undefined

	const { images, variants, ...rest } = product

	return {
		...rest,
		images: reshapeImages(images, product.title),
		variants: removeEdgesAndNodes(variants),
	}
}

export const reshapeProducts = (products: ShopifyProduct[]) => {
	return products
		.filter((product): product is ShopifyProduct => product !== undefined)
		.map((product) => reshapeProduct(product))
		.filter((product): product is Product => product !== undefined)
}
