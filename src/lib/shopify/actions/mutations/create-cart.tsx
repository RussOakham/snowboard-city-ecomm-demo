import { shopifyFetch } from '@/lib/shopify'

import { createCartMutation } from '../../mutations/cart'
import { Cart, ShopifyCreateCartOperation } from '../../types/cart'
import { reshapeCart } from '../../utils'

export async function createCart(): Promise<Cart> {
	const res = await shopifyFetch<ShopifyCreateCartOperation>({
		query: createCartMutation,
		cache: 'no-store',
	})

	return reshapeCart(res.body.data.cartCreate.cart)
}
