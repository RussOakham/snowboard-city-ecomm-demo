import { Connection, SEO } from './shopify'

export type Collection = ShopifyCollection & {
	path: string
}

export type ShopifyCollection = {
	handle: string
	title: string
	description: string
	seo: SEO
	updatedAt: string
}

export type ShopifyCollectionOperation = {
	data: {
		collection: ShopifyCollection
	}
	variables: {
		handle: string
	}
}

export type ShopifyCollectionsOperation = {
	data: {
		collections: Connection<ShopifyCollection>
	}
}
