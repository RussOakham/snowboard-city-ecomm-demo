import { useSuspenseQuery } from '@tanstack/react-query'

import { getMenu } from '@/lib/shopify/actions/get-menu'

export const useGetMenuQuery = (handle: string) => {
	const { data, isLoading, isError, isSuccess } = useSuspenseQuery({
		queryKey: ['menu', handle],
		queryFn: async () => getMenu(handle),
	})

	return { data, isLoading, isError, isSuccess }
}
