import { useSuspenseQuery } from '@tanstack/react-query'

import { getCart } from '@/lib/shopify/actions/queries/get-cart'

export const useGetCartQuery = (cartId: string) => {
	const query = useSuspenseQuery({
		queryKey: ['cart', cartId],
		queryFn: async () => getCart(cartId),
	})

	return [query.data] as const
}
