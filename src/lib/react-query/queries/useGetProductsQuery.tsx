import { useSuspenseQuery } from '@tanstack/react-query'

import { getProducts } from '@/lib/shopify/actions/queries/get-products'

export const useGetProductsQuery = ({
	sortKey,
	reverse,
	query,
}: {
	sortKey?: string
	reverse?: boolean
	query?: string
}) => {
	const res = useSuspenseQuery({
		queryKey: ['products', query, sortKey, reverse],
		queryFn: async () =>
			getProducts({
				query,
				sortKey,
				reverse,
			}),
	})

	return [res.data] as const
}
