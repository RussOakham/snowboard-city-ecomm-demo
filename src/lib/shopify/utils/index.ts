import { HIDDEN_PRODUCT_TAG } from '../constants'
import { Cart, ShopifyCart } from '../types/cart'
import { Collection, ShopifyCollection } from '../types/collection'
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

export const reshapeCart = (cart: ShopifyCart): Cart => {
	if (!cart.cost?.totalTaxAmount) {
		return {
			...cart,
			lines: removeEdgesAndNodes(cart.lines),
			cost: {
				...cart.cost,
				totalTaxAmount: {
					amount: '0.00',
					currencyCode: 'GBP',
				},
			},
		}
	}

	return {
		...cart,
		lines: removeEdgesAndNodes(cart.lines),
	}
}

export const reshapeCollection = (
	collection: ShopifyCollection,
): Collection | undefined => {
	if (!collection) {
		return undefined
	}

	return {
		...collection,
		path: `/search/${collection.handle}`,
	}
}

export const reshapeCollections = (collections: ShopifyCollection[]) => {
	const reshapedCollections = []

	// eslint-disable-next-line no-restricted-syntax
	for (const collection of collections) {
		if (collection) {
			const reshapedCollection = reshapeCollection(collection)

			if (reshapedCollection) {
				reshapedCollections.push(reshapedCollection)
			}
		}
	}

	return reshapedCollections
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
