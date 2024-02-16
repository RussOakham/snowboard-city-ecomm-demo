'use client'

import { useCallback, useMemo } from 'react'

import { Shell } from '@/components/layouts/shells/shell'
import {
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from '@/components/page-header'
import { Products } from '@/components/products'
import { useGetProductsQuery } from '@/lib/react-query/queries/useGetProductsQuery'
import { defaultSort, sorting } from '@/lib/shopify/constants'
import { Product } from '@/lib/shopify/types/product'
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

	const categoryQuery = category ? `product_type:${category}` : ''

	const queryString = categoryQuery

	const [products] = useGetProductsQuery({
		sortKey,
		reverse,
		query: queryString,
	})

	// Temporary client side filter, as Shopify doesn't support all $query parameters
	// TODO: Refactor Shopify GraphQL query to accept filter params
	const filterProducts = useCallback(
		(productsData: Product[], inStockBool: boolean, priceRange: string) => {
			let filteredProducts = productsData

			if (inStockBool) {
				filteredProducts = products.filter(
					(product) => product.availableForSale,
				)
			}

			if (!inStockBool) {
				filteredProducts = products.filter(
					(product) => !product.availableForSale,
				)
			}

			const [min, max] = priceRange.split('-')
			filteredProducts = filteredProducts.filter(
				(product) =>
					Number(product.priceRange.minVariantPrice.amount) >= Number(min) &&
					Number(product.priceRange.minVariantPrice.amount) <= Number(max),
			)

			return filteredProducts
		},
		[products],
	)

	let inStockBool = true

	if (inStock === 'false') {
		inStockBool = false
	}

	let priceRange = '0-2000'

	if (price_range) {
		priceRange = price_range
	}

	const filteredProducts = useMemo(() => {
		return filterProducts(products, inStockBool, priceRange)
	}, [filterProducts, inStockBool, priceRange, products])

	return (
		<Shell>
			<PageHeader>
				<PageHeaderHeading size="sm">Products</PageHeaderHeading>
				<PageHeaderDescription size="sm">
					Buy the best products from our store
				</PageHeaderDescription>
			</PageHeader>
			<Products
				products={filteredProducts}
				categories={categories}
				pageCount={1}
			/>
			{modal}
		</Shell>
	)
}
