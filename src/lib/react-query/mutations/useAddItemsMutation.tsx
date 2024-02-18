import { useMutation, useQueryClient } from '@tanstack/react-query'

import { addItems } from '@/lib/actions/cart'
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

export const useAddItemsMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			prevState,
			selectedVariantId,
			quantity,
		}: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			prevState: any
			selectedVariantId: string | undefined
			quantity: number
			product: Product
			cartId: string | undefined
		}) => addItems(prevState, selectedVariantId, quantity),

		// Augment caches to mimic onSuccess scenario, to provide optimistic UX.
		// If no existing cart (cartid is undefined), create a new cart with the selected variant.
		onMutate: async ({
			selectedVariantId,
			quantity,
			product,
			cartId,
		}: {
			selectedVariantId: string | undefined
			quantity: number
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

			// Check if cart already has the selected variant in it
			const existingLine = cart.lines.find(
				(line) => line.merchandise.id === selectedVariant.id,
			)

			// If it does, increment the quantity of that line
			if (existingLine) {
				const optimisticCart: Cart = {
					...cart,
					lines: cart.lines.map((line) => {
						if (line.id === existingLine.id) {
							return {
								...line,
								quantity: line.quantity + quantity,
							}
						}
						return line
					}),
					cost: {
						...cart.cost,
						subtotalAmount: {
							amount: (
								Number(cart.cost.subtotalAmount.amount) +
								Number(selectedVariant.price.amount) * quantity
							).toString(),
							currencyCode:
								cart.cost.subtotalAmount.currencyCode ??
								selectedVariant.price.currencyCode,
						},
						totalAmount: {
							amount: (
								Number(cart.cost.totalAmount.amount) +
								Number(selectedVariant.price.amount) * quantity
							).toString(),
							currencyCode:
								cart.cost.totalAmount.currencyCode ??
								selectedVariant.price.currencyCode,
						},
						totalTaxAmount: {
							amount: (
								Number(cart.cost.totalTaxAmount.amount) +
								Number(selectedVariant.price.amount) * quantity
							).toString(),
							currencyCode:
								cart.cost.totalTaxAmount.currencyCode ??
								selectedVariant.price.currencyCode,
						},
					},
					totalQuantity: cart.totalQuantity + quantity,
				}

				// Set cart to optimistic state
				queryClient.setQueryData<Cart>(['cart', cartId], optimisticCart)

				return { previousCart }
			}

			// If it doesn't, add a new line to the cart
			const optimisticCart: Cart = {
				...cart,
				lines: [
					...cart.lines,
					{
						id: 'temp-id',
						quantity,
						cost: {
							totalAmount: {
								amount: (
									Number(selectedVariant.price.amount) * quantity
								).toString(),
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
				cost: {
					...cart.cost,
					subtotalAmount: {
						amount: (
							Number(cart.cost.subtotalAmount.amount) +
							Number(selectedVariant.price.amount) * quantity
						).toString(),
						currencyCode:
							cart.cost.subtotalAmount.currencyCode ??
							selectedVariant.price.currencyCode,
					},
					totalAmount: {
						amount: (
							Number(cart.cost.totalAmount.amount) +
							Number(selectedVariant.price.amount) * quantity
						).toString(),
						currencyCode:
							cart.cost.totalAmount.currencyCode ??
							selectedVariant.price.currencyCode,
					},
					totalTaxAmount: {
						amount: (
							Number(cart.cost.totalTaxAmount.amount) +
							Number(selectedVariant.price.amount) * quantity
						).toString(),
						currencyCode:
							cart.cost.totalTaxAmount.currencyCode ??
							selectedVariant.price.currencyCode,
					},
				},
				totalQuantity: cart.totalQuantity + quantity,
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
