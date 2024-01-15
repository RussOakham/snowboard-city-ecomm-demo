import { useSuspenseQuery } from "@tanstack/react-query"

import { getProducts } from "@/lib/shopify/actions/get-products"

export const useGetProductsQuery = () => {
	const { data, isLoading, isError, isSuccess } = useSuspenseQuery({
		queryKey: ['products'],
		queryFn: async () => getProducts({}),
	})

	return { data, isLoading, isError, isSuccess }
}
