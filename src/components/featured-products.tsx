'use client'

import { useGetProductsQuery } from '@/lib/react-query/queries/useGetProductsQuery'

import ProductCard from './cards/product-card'

export const FeaturedProducts = () => {
	// Collections that start with `hidden-*` are hidden from the search page.
	// Update to use Featured Products Query - create new collection in Shopify?
	// Add maximum turn number - 8?
	const { data: products, isLoading, isError } = useGetProductsQuery()

	if (isLoading) return <p>Loading...</p>

	if (isError) return <p>Error</p>

	if (!products || products.length === 0) return <p>No products found.</p>

	return (
		<>
			{products.map((product) => (
				<ProductCard product={product} key={product.id} />
			))}
		</>
	)
}
