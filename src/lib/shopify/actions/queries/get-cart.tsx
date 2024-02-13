import { shopifyFetch } from '@/lib/shopify'

import { Cart, ShopifyCartOperation } from '../../types/cart'
import { getCartQuery } from '../../queries/cart'
import { TAGS } from '../../constants'
import { reshapeCart } from '../../utils'

export async function getCart(cartId: string): Promise<Cart | undefined> {
	const res = await shopifyFetch<ShopifyCartOperation>({
		query: getCartQuery,
		variables: {
			cartId,
		},
		tags: [TAGS.cart],
		cache: 'no-store',
	})

	// Old carts become `null` when you checkout.
	if (!res.body.data.cart) {
		return undefined
	}

	return reshapeCart(res.body.data.cart)
}
