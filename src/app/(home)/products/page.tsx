'use client'

import { Shell } from '@/components/layouts/shells/shell'
import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from '@/components/page-header'
import { Products } from '@/components/products'
import { useGetProductsQuery } from '@/lib/react-query/queries/useGetProductsQuery'
import { defaultSort, sorting } from '@/lib/shopify/constants'
import { SearchParams } from '@/types'

interface ProductsPageProps {
	searchParams: SearchParams
	modal: React.ReactNode
}

const categories = [
	'snowboards',
	'ski-jackets',
	'goggles',
	'snowboard-boots',
	'gift-card',
	'accessories',
]

export default function ProductsPage({
	searchParams,
	modal,
}: ProductsPageProps) {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { sort, category, inStock, price_range } = searchParams as {
		[key: string]: string
	}
	const { sortKey, reverse } =
		sorting.find((item) => item.slug === sort) ?? defaultSort

	const inStockQuery = inStock ? `available:${inStock}` : `available:true`

	const categoryQuery = category ? `product_type:${category}` : ''

	const priceRangeQueryMin = price_range
		? `price_range.min_variant_price.amount:>${price_range.split('-')[0]}`
		: ''

	const priceRangeQueryMax = price_range
		? `price_range.min_variant_price.amount:<${price_range.split('-')[1]}`
		: ''

	const queryString = `${inStockQuery}${categoryQuery ? ` ${categoryQuery}` : ''}${priceRangeQueryMin ? ` ${priceRangeQueryMin}` : ''}${priceRangeQueryMax ? ` ${priceRangeQueryMax}` : ''}`

	const [products] = useGetProductsQuery({
		sortKey,
		reverse,
		query: queryString,
	})

	return (
		<Shell>
			<PageHeader>
				<PageHeaderHeading size="sm">Products</PageHeaderHeading>
				<PageHeaderDescription size="sm">
					Buy the best products from our store
				</PageHeaderDescription>
			</PageHeader>
			<Products products={products} categories={categories} pageCount={1} />
			{modal}
		</Shell>
	)
}
