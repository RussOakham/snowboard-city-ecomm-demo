import { env } from '@/env.mjs'

import { SHOPIFY_GRAPHQL_API_ENDPOINT } from './constants'

export const domain = `https://${env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`
const key = env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

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
