'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

import { Products } from '@/components/products'
import { useGetProductsQuery } from '@/lib/react-query/queries/useGetProductsQuery'
import { defaultSort, sorting } from '@/lib/shopify/constants'
import { Product } from '@/lib/shopify/types/product'

const categories = [
	'snowboards',
	'ski-jackets',
	'goggles',
	'snowboard-boots',
	'gift-card',
	'accessories',
]

export function ProductsPageContainer() {
	const searchParams = useSearchParams()

	const sort = searchParams.get('sort')
	const category = searchParams.get('category')
	const inStock = searchParams.get('inStock')
	const priceRange = searchParams.get('price_range')

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
		(
			productsData: Product[],
			inStockBool: boolean,
			priceRangeScale: string,
		) => {
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

			const [min, max] = priceRangeScale.split('-')
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

	let priceRangeFilter = '0-2000'

	if (priceRange) {
		priceRangeFilter = priceRange
	}

	const filteredProducts = useMemo(() => {
		return filterProducts(products, inStockBool, priceRangeFilter)
	}, [filterProducts, inStockBool, priceRangeFilter, products])

	return (
		<Products
			products={filteredProducts}
			categories={categories}
			pageCount={1}
		/>
	)
}
