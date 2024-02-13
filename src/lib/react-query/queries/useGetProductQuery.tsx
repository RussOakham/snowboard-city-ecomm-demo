import { useSuspenseQuery } from '@tanstack/react-query'

import { getProduct } from '@/lib/shopify/actions/get-product'
import { Product } from '@/lib/shopify/types/product'

export const useGetProductQuery = (handle: string) => {
	const query = useSuspenseQuery({
		queryKey: ['product', handle],
		queryFn: async () => getProduct(handle),
	})

	return [query.data as Product] as const
}
