import { domain, shopifyFetch } from '@/lib/shopify'

import { TAGS } from '../constants'
import { getMenuQuery } from '../queries/menu'
import { Menu, ShopifyMenuOperation } from '../types/menu'

export async function getMenu(handle: string): Promise<Menu[]> {
	const res = await shopifyFetch<ShopifyMenuOperation>({
		query: getMenuQuery,
		tags: [TAGS.collections],
		variables: {
			handle,
		},
	})

	return (
		res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
			title: item.title,
			href: item.url
				.replace(domain, '')
				.replace('/collections', '/search')
				.replace('/pages', ''),
		})) ?? []
	)
}
