import { shopifyFetch } from '@/lib/shopify'

import { addToCartMutation } from '../../mutations/cart'
import { Cart, ShopifyAddToCartOperation } from '../../types/cart'
import { reshapeCart } from '../../utils'

export async function addToCart(
	cartId: string,
	lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
	const res = await shopifyFetch<ShopifyAddToCartOperation>({
		query: addToCartMutation,
		variables: {
			cartId,
			lines,
		},
		cache: 'no-store',
	})

	return reshapeCart(res.body.data.cartLinesAdd.cart)
}
