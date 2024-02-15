import { Connection, Image, Money, SEO } from './shopify'

export type Product = Omit<ShopifyProduct, 'variants' | 'images'> & {
	variants: ProductVariant[]
	images: Image[]
}

export type ProductOption = {
	id: string
	name: string
	values: string[]
}

export type ProductVariant = {
	id: string
	title: string
	availableForSale: boolean
	selectedOptions: {
		name: string
		value: string
	}[]
	price: Money
}

export type ShopifyProduct = {
	id: string
	handle: string
	availableForSale: boolean
	title: string
	description: string
	descriptionHtml: string
	options: ProductOption[]
	priceRange: {
		maxVariantPrice: Money
		minVariantPrice: Money
	}
	variants: Connection<ProductVariant>
	featuredImage: Image
	images: Connection<Image>
	productType: string
	totalInventory: number
	seo: SEO
	tags: string[]
	updatedAt: string
}

export type ShopifyCollectionProductsOperation = {
	data: {
		collection: {
			products: Connection<ShopifyProduct>
		}
	}
	variables: {
		handle: string
		reverse?: boolean
		sortKey?: string
	}
}

export type ShopifyProductOperation = {
	data: { product: ShopifyProduct }
	variables: {
		handle: string
	}
}

export type ShopifyProductRecommendationsOperation = {
	data: {
		productRecommendations: ShopifyProduct[]
	}
	variables: {
		productId: string
	}
}

export type ShopifyProductsOperation = {
	data: {
		products: Connection<ShopifyProduct>
	}
	variables: {
		query?: string
		reverse?: boolean
		sortKey?: string
	}
}
