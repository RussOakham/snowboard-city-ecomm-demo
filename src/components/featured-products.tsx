'use client'

import { Suspense } from 'react'

import { useGetProductsQuery } from '@/lib/react-query/queries/useGetProductsQuery'

import ProductCard from './cards/product-card'
import { ErrorBoundary } from './layouts/error-boundary'

export const FeaturedProducts = () => {
	// Collections that start with `hidden-*` are hidden from the search page.
	// Update to use Featured Products Query - create new collection in Shopify?
	// Add maximum turn number - 8?
	const [products] = useGetProductsQuery({})

	if (!products || products.length === 0) return <p>No products found.</p>

	// limit map to return 8 items
	const featuredProducts = products.slice(0, 8)

	return (
		<ErrorBoundary>
			<Suspense fallback={<div>Loading Featured Products...</div>}>
				{featuredProducts.map((product) => (
					<ProductCard product={product} key={product.id} />
				))}
			</Suspense>
		</ErrorBoundary>
	)
}
