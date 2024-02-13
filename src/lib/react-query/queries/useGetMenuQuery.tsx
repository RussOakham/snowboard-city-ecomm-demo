import { useSuspenseQuery } from '@tanstack/react-query'

import { getMenu } from '@/lib/shopify/actions/get-menu'

export const useGetMenuQuery = (handle: string) => {
	const query = useSuspenseQuery({
		queryKey: ['menu', handle],
		queryFn: async () => getMenu(handle),
	})

	return [query.data] as const
}
