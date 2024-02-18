import { shopifyFetch } from '@/lib/shopify'

import { TAGS } from '../../constants'
import { getCollectionProductsQuery } from '../../queries/collection'
import {
	Product,
	ShopifyCollectionProductsOperation,
} from '../../types/product'
import { removeEdgesAndNodes, reshapeProducts } from '../../utils'

export async function getCollection({
	collection,
	reverse,
	sortKey,
}: {
	collection: string
	reverse?: boolean
	sortKey?: string
}): Promise<Product[]> {
	const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
		query: getCollectionProductsQuery,
		tags: [TAGS.collections, TAGS.products],
		variables: {
			handle: collection,
			reverse,
			sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey,
		},
	})

	if (!res.body.data.collection) {
		// eslint-disable-next-line no-console
		console.log(`No collection found for "${collection}"`)
		return []
	}

	return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products))
}
