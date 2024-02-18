import { useMutation, useQueryClient } from '@tanstack/react-query'

import { addItem } from '@/lib/actions/cart'
import { Cart } from '@/lib/shopify/types/cart'
import { Product } from '@/lib/shopify/types/product'

const emptyCart: Cart = {
	id: '',
	checkoutUrl: '',
	cost: {
		subtotalAmount: {
			amount: '0',
			currencyCode: 'USD',
		},
		totalAmount: {
			amount: '0',
			currencyCode: 'USD',
		},
		totalTaxAmount: {
			amount: '0',
			currencyCode: 'USD',
		},
	},
	lines: [],
	totalQuantity: 0,
}

export const useAddItemMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		// Call server function which creates cart if it doesn't exist and adds item to cart
		mutationFn: ({
			prevState,
			selectedVariantId,
		}: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			prevState: any
			selectedVariantId: string
			product: Product
			cartId: string | undefined
		}) => addItem(prevState, selectedVariantId),

		// Augment caches to mimic onSuccess scenario, to provide optimistic UX.
		// If no existing cart (cartid is undefined), create a new cart with the selected variant.
		onMutate: async ({
			selectedVariantId,
			product,
			cartId,
		}: {
			selectedVariantId: string
			product: Product
			cartId: string | undefined
		}) => {
			const selectedVariant = product.variants.find(
				(v) => v.id === selectedVariantId,
			)

			if (!selectedVariant || !selectedVariantId) {
				throw new Error('Missing product variant ID')
			}

			if (!product) {
				throw new Error('Missing product information')
			}

			// Cancel any outgoing cart queries
			await queryClient.cancelQueries({ queryKey: ['cart', cartId] })

			// Get previous Cart state and if no previous cart, set to mocked empty cart state
			const previousCart = queryClient.getQueryData<Cart>(['cart', cartId])

			const cart: Cart = previousCart ?? emptyCart

			const optimisticCart: Cart = {
				...cart,
				lines: [
					...cart.lines,
					{
						id: 'temp-id',
						quantity: 1,
						cost: {
							totalAmount: {
								amount: selectedVariant.price.amount,
								currencyCode: selectedVariant.price.currencyCode,
							},
						},
						merchandise: {
							id: selectedVariant.id,
							title: product.title,
							selectedOptions: selectedVariant.selectedOptions,
							product,
						},
					},
				],
				totalQuantity: cart.totalQuantity + 1,
			}

			// Set cart to optimistic state
			queryClient.setQueryData<Cart>(['cart', cartId], optimisticCart)

			return { previousCart }
		},
		onError: (err, variables, context) => {
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
			if (data === 'Missing product variant ID') {
				throw new Error('Missing product variant ID')
			}

			if (data === 'Error adding item to cart') {
				throw new Error('Error adding item to cart')
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
