import { getCollectionProductsQuery } from './queries/collection'
import { SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from './constants'
import { Product, ShopifyCollectionProductsOperation } from './types'
import { removeEdgesAndNodes, reshapeProducts } from './utils'

const domain = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!}`
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`
const key = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!

type ExtractVariables<T> = T extends { variables: object }
	? T['variables']
	: never

export async function shopifyFetch<T>({
	cache = 'force-cache',
	headers,
	query,
	tags,
	variables,
}: {
	cache?: RequestCache
	headers?: HeadersInit
	query?: string
	tags?: string[]
	variables?: ExtractVariables<T>
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
}): Promise<{ status: number; body: T } | never> {
	const result = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': key,
			...headers,
		},
		body: JSON.stringify({
			...(query && { query }),
			...(variables && { variables }),
		}),
		cache,
		...(tags && { next: { tags } }),
	})

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const body = await result.json()

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	if (body.errors) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		throw body.errors[0]
	}

	return {
		status: result.status,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		body,
	}
}

export async function getCollectionProducts({
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
