import { useSuspenseQuery } from '@tanstack/react-query'

import { getCollection } from '@/lib/shopify/actions/get-collections'

interface UseGetCollectionQueryParams {
	collection: string
	reverse?: boolean
	sortKey?: 'CREATED_AT' | 'CREATED'
}

export const useGetCollectionQuery = ({
	collection,
	reverse,
	sortKey,
}: UseGetCollectionQueryParams) => {
	const { data, isLoading, isError, isSuccess } = useSuspenseQuery({
		queryKey: ['collection', collection, reverse, sortKey],
		queryFn: async () =>
			getCollection({
				collection,
				reverse,
				sortKey,
			}),
	})

	return { data, isLoading, isError, isSuccess }
}
