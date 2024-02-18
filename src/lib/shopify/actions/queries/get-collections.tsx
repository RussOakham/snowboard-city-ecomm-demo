import { shopifyFetch } from '@/lib/shopify'

import { TAGS } from '../../constants'
import { getCollectionsQuery } from '../../queries/collection'
import { Collection, ShopifyCollectionsOperation } from '../../types/collection'
import { removeEdgesAndNodes, reshapeCollections } from '../../utils'

export async function getCollections(): Promise<Collection[]> {
	const res = await shopifyFetch<ShopifyCollectionsOperation>({
		query: getCollectionsQuery,
		tags: [TAGS.collections],
	})
	const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections)
	const collections = [
		{
			handle: '',
			title: 'All',
			description: 'All products',
			seo: {
				title: 'All',
				description: 'All products',
			},
			path: '/search',
			updatedAt: new Date().toISOString(),
		},
		// Filter out the `hidden` collections.
		// Collections that start with `hidden-*` need to be hidden on the search page.
		...reshapeCollections(shopifyCollections).filter(
			(collection) => !collection.handle.startsWith('hidden'),
		),
	]

	return collections
}
