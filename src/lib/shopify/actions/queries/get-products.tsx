import { shopifyFetch } from '@/lib/shopify'

import { TAGS } from '../../constants'
import { getProductsQuery } from '../../queries/product'
import { Product, ShopifyProductsOperation } from '../../types/product'
import { removeEdgesAndNodes, reshapeProducts } from '../../utils'

export async function getProducts({
	query,
	reverse,
	sortKey,
}: {
	query?: string
	reverse?: boolean
	sortKey?: string
}): Promise<Product[]> {
	const res = await shopifyFetch<ShopifyProductsOperation>({
		query: getProductsQuery,
		tags: [TAGS.products],
		variables: {
			query,
			reverse,
			sortKey,
		},
	})

	return reshapeProducts(removeEdgesAndNodes(res.body.data.products))
}
