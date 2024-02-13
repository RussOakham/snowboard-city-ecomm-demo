import { useSuspenseQuery } from '@tanstack/react-query'

import { getProduct } from '@/lib/shopify/actions/get-product'

export const useGetProductQuery = (handle: string) => {
	const query = useSuspenseQuery({
		queryKey: ['product', handle],
		queryFn: async () => getProduct(handle),
	})

	return [query.data] as const
}
