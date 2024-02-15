import { shopifyFetch } from '@/lib/shopify'

import { removeFromCartMutation } from '../../mutations/cart'
import { Cart, ShopifyRemoveFromCartOperation } from '../../types/cart'
import { reshapeCart } from '../../utils'

export async function removeFromCart(
	cartId: string,
	lineIds: string[],
): Promise<Cart> {
	const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
		query: removeFromCartMutation,
		variables: {
			cartId,
			lineIds,
		},
		cache: 'no-store',
	})

	return reshapeCart(res.body.data.cartLinesRemove.cart)
}
