'use server'

import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

import { addToCart } from '../shopify/actions/mutations/add-to-cart'
import { createCart } from '../shopify/actions/mutations/create-cart'
import { removeFromCart } from '../shopify/actions/mutations/remove-from-cart'
import { updateCart } from '../shopify/actions/mutations/update-cart'
import { getCart } from '../shopify/actions/queries/get-cart'
import { TAGS } from '../shopify/constants'

export async function addItem(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	prevState: any,
	selectedVariantId: string | undefined,
) {
	let cartId = cookies().get('cartId')?.value
	let cart

	if (cartId) {
		cart = await getCart(cartId)
	}

	if (!cartId || !cart) {
		cart = await createCart()
		cartId = cart.id
		cookies().set('cartId', cartId)
	}

	if (!selectedVariantId) {
		return 'Missing product variant ID'
	}

	try {
		await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity: 1 }])
		revalidateTag(TAGS.cart)
		return 'Item added to cart'
	} catch (e) {
		return 'Error adding item to cart'
	}
}

export async function addItems(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	prevState: any,
	selectedVariantId: string | undefined,
	quantity: number,
) {
	let cartId = cookies().get('cartId')?.value
	let cart

	if (cartId) {
		cart = await getCart(cartId)
	}

	if (!cartId || !cart) {
		cart = await createCart()
		cartId = cart.id
		cookies().set('cartId', cartId)
	}

	if (!selectedVariantId) {
		return 'Missing product variant ID'
	}

	try {
		await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity }])
		revalidateTag(TAGS.cart)
		return 'Item added to cart'
	} catch (e) {
		return 'Error adding item to cart'
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function removeItem(prevState: any, lineId: string) {
	const cartId = cookies().get('cartId')?.value

	if (!cartId) {
		return 'Missing cart ID'
	}

	try {
		await removeFromCart(cartId, [lineId])
		revalidateTag(TAGS.cart)
		return 'Item removed from cart'
	} catch (e) {
		return 'Error removing item from cart'
	}
}

export async function updateItemQuantity(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	prevState: any,
	payload: {
		lineId: string
		variantId: string
		quantity: number
	},
) {
	const cartId = cookies().get('cartId')?.value

	if (!cartId) {
		return 'Missing cart ID'
	}

	const { lineId, variantId, quantity } = payload

	try {
		if (quantity === 0) {
			await removeFromCart(cartId, [lineId])
			revalidateTag(TAGS.cart)
			return 'Item removed from cart'
		}

		await updateCart(cartId, [
			{ id: lineId, merchandiseId: variantId, quantity },
		])
		revalidateTag(TAGS.cart)
		return 'Item quantity updated'
	} catch (e) {
		return 'Error updating item quantity'
	}
}
