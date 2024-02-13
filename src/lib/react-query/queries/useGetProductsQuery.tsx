import { useSuspenseQuery } from '@tanstack/react-query'

import { getProducts } from '@/lib/shopify/actions/get-products'

export const useGetProductsQuery = () => {
	const query = useSuspenseQuery({
		queryKey: ['products'],
		queryFn: async () => getProducts({}),
	})

	return [query.data] as const
}
