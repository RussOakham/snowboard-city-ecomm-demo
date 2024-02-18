import { useMutation, useQueryClient } from '@tanstack/react-query'

import { removeItem } from '@/lib/actions/cart'
import { Cart, CartItem } from '@/lib/shopify/types/cart'

export const useRemoveItemMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			prevState,
			cartLineItem,
		}: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			prevState: any
			cartLineItem: CartItem
		}) => removeItem(prevState, cartLineItem.id),

		// Augment caches to mimic onSuccess scenario, to provide optimistic UX.
		onMutate: async ({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			prevState,
			cartLineItem,
			cartId,
		}: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			prevState: any
			cartLineItem: CartItem
			cartId: string | undefined
		}) => {
			if (!cartLineItem.id) {
				throw new Error('Missing cart line ID')
			}

			if (!cartId) {
				throw new Error('Missing cart ID')
			}

			// Cancel any outgoing cart queries
			await queryClient.cancelQueries({ queryKey: ['cart', cartId] })

			// Get previous Cart state and if no previous cart, throw error
			const previousCart = queryClient.getQueryData<Cart>(['cart', cartId])

			if (!previousCart) {
				throw new Error('No cart found')
			}

			// Optimistically update the cart
			const optimisticCart: Cart = {
				...previousCart,
				lines: previousCart.lines.filter((line) => line.id !== cartLineItem.id),
				cost: {
					...previousCart.cost,
					subtotalAmount: {
						...previousCart.cost.subtotalAmount,
						amount: (
							Number(previousCart.cost.subtotalAmount.amount) -
							Number(cartLineItem.cost.totalAmount.amount)
						).toString(),
					},
					totalAmount: {
						...previousCart.cost.totalAmount,
						amount: (
							Number(previousCart.cost.totalAmount.amount) -
							Number(cartLineItem.cost.totalAmount.amount)
						).toString(),
					},
					totalTaxAmount: {
						...previousCart.cost.totalTaxAmount,
						amount: (
							Number(previousCart.cost.totalTaxAmount.amount) -
							Number(cartLineItem.cost.totalAmount.amount)
						).toString(),
					},
				},
				totalQuantity: previousCart.totalQuantity - cartLineItem.quantity,
			}

			// Set cart to optimistic state
			queryClient.setQueryData<Cart>(['cart', cartId], optimisticCart)

			return { previousCart }
		},
		onError: (err, variables, context) => {
			// if error happens in mutation 'cart' cache is reset to previous state
			if (context?.previousCart) {
				queryClient.setQueryData(
					['cart', variables.cartLineItem.id],
					context.previousCart,
				)
			}
		},
		onSuccess: (data) => {
			// Shopify request always returns 200, so need to manually check and throw errors
			if (data === 'Missing cart ID') {
				throw new Error('Missing cart ID')
			}

			if (data === 'Error removing item from cart') {
				throw new Error('Error removing item from cart')
			}

			return data
		},
		onSettled: async (data, error, variables) => {
			// Always invalidate cache after error or success, to trigger refetch for fresh data
			await queryClient.invalidateQueries({
				queryKey: ['cart', variables.cartLineItem.id],
			})
		},
	})
}
