'use client'

import { useSearchParams } from 'next/navigation'

import { Products } from '@/components/products'
import { useGetProductsQuery } from '@/lib/react-query/queries/useGetProductsQuery'
import { defaultSort, sorting } from '@/lib/shopify/constants'

const categories = [
	'snowboards',
	'ski-jackets',
	'goggles',
	'snowboard-boots',
	'gift-card',
	'accessories',
]

export function SearchPageContainer() {
	const searchParams = useSearchParams()

	const sort = searchParams.get('sort')
	const search = searchParams.get('query')

	const { sortKey, reverse } =
		sorting.find((item) => item.slug === sort) ?? defaultSort

	let searchValue = ''

	if (search) {
		searchValue = `title:${search}* OR tags:${search}*`
	}

	const [products] = useGetProductsQuery({
		sortKey,
		reverse,
		query: searchValue,
	})

	return (
		<Products
			products={products}
			categories={categories}
			pageCount={1}
			showFilterOptions={false}
		/>
	)
}
