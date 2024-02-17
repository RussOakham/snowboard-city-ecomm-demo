import { useSuspenseQuery } from '@tanstack/react-query'

import { getMenu } from '@/lib/shopify/actions/queries/get-menu'

export const useGetMenuQuery = (handle: string) => {
	const res = useSuspenseQuery({
		queryKey: ['menu', handle],
		queryFn: async () => getMenu(handle),
	})

	return [res.data] as const
}
