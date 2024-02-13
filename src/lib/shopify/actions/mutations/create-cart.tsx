import { shopifyFetch } from '@/lib/shopify'

import { Cart, ShopifyCreateCartOperation } from '../../types/cart'
import { createCartMutation } from '../../mutations/cart'
import { reshapeCart } from '../../utils'

export async function createCart(): Promise<Cart> {
	const res = await shopifyFetch<ShopifyCreateCartOperation>({
		query: createCartMutation,
		cache: 'no-store',
	})

	return reshapeCart(res.body.data.cartCreate.cart)
}
