import { shopifyFetch } from '@/lib/shopify'

import { editCartItemsMutation } from '../../mutations/cart'
import { Cart, ShopifyUpdateCartOperation } from '../../types/cart'
import { reshapeCart } from '../../utils'

export async function updateCart(
	cartId: string,
	lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
	const res = await shopifyFetch<ShopifyUpdateCartOperation>({
		query: editCartItemsMutation,
		variables: {
			cartId,
			lines,
		},
		cache: 'no-store',
	})

	return reshapeCart(res.body.data.cartLinesUpdate.cart)
}
