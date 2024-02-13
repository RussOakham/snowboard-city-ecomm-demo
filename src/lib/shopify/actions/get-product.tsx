import { TAGS } from '../constants'
import { getProductQuery } from '../queries/product'
import { Product, ShopifyProductOperation } from '../types/product'
import { reshapeProduct } from '../utils'
import { shopifyFetch } from '..'

export async function getProduct(handle: string): Promise<Product | undefined> {
	const res = await shopifyFetch<ShopifyProductOperation>({
		query: getProductQuery,
		tags: [TAGS.products],
		variables: {
			handle,
		},
	})

	return reshapeProduct(res.body.data.product, false)
}
