import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateItemQuantity } from '@/lib/actions/cart'
import { Cart } from '@/lib/shopify/types/cart'

export const useUpdateItemQuantityMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		// Call server function which updates cart item quantity
		mutationFn: ({
			prevState,
			payload,
		}: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			prevState: any
			payload: {
				lineId: string
				variantId: string
				quantity: number
			}
			cartId: string | undefined
		}) => updateItemQuantity(prevState, payload),

		onMutate: async ({
			payload,
			cartId,
		}: {
			payload: {
				lineId: string
				variantId: string
				quantity: number
			}
			cartId: string | undefined
		}) => {
			if (!cartId) {
				throw new Error('Missing cart ID')
			}

			if (!payload.lineId) {
				throw new Error('Missing cart line item ID')
			}

			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ['cart', cartId] })

			// Get previous Cart state and if no previous cart, throw error
			const previousCart = queryClient.getQueryData<Cart>(['cart', cartId])

			if (!previousCart) {
				throw new Error('Could not find existing cart')
			}

			const previousLineQuantity =
				previousCart.lines.find((line) => line.id === payload.lineId)
					?.quantity ?? 0

			const quantityChange = payload.quantity - previousLineQuantity

			const singleTotalItemCost =
				Number(
					previousCart.lines.find((line) => line.id === payload.lineId)
						?.merchandise.product.priceRange.minVariantPrice.amount,
				) ?? 0

			const totalAmountCostChange = singleTotalItemCost * quantityChange

			// Optimistically update the cart in the cache with the new quantity
			const optimisticCart: Cart = {
				...previousCart,
				lines: previousCart.lines.map((line) => {
					if (line.id === payload.lineId) {
						return {
							...line,
							quantity: payload.quantity,
							cost: {
								totalAmount: {
									...line.cost.totalAmount,
									amount: (singleTotalItemCost * payload.quantity).toString(),
								},
							},
						}
					}
					return line
				}),
				cost: {
					...previousCart.cost,
					totalAmount: {
						...previousCart.cost.totalAmount,
						amount: (
							Number(previousCart.cost.totalAmount.amount) +
							totalAmountCostChange
						).toString(),
					},
				},
				totalQuantity: previousCart.totalQuantity + quantityChange,
			}

			// Set cart to optimistic state
			queryClient.setQueryData<Cart>(['cart', cartId], optimisticCart)

			return { previousCart }
		},

		onError: (error, variables, context) => {
			// if error happens in mutation 'cart' cache is reset to previous state
			if (context?.previousCart) {
				queryClient.setQueryData(
					['cart', variables.cartId],
					context.previousCart,
				)
			}
		},
		onSuccess: (data) => {
			// Shopify request always returns 200, so need to manually check and throw errors
			if (data === 'Error updating item quantity') {
				throw new Error('Error updating item quantity')
			}

			if (data === 'Missing cart ID') {
				throw new Error('Missing cart ID')
			}

			return data
		},
		onSettled: async (data, error, variables) => {
			// Always invalidate cache after error or success, to trigger refetch for fresh data
			await queryClient.invalidateQueries({
				queryKey: ['cart', variables.cartId],
			})
		},
	})
}
