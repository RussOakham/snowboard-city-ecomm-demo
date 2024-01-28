'use client'

import { useGetProductsQuery } from '@/lib/react-query/queries/useGetProductsQuery'
import { Product } from '@/lib/shopify/types/product'

const ProductComponent = ({ product }: { product: Product }) => {
	return <li key={product.id}>{product.title}</li>
}

export const GetCollectionProducts = () => {
	// Collections that start with `hidden-*` are hidden from the search page.
	const { data: products, isLoading, isError } = useGetProductsQuery()

	if (isLoading) return <p>Loading...</p>

	if (isError) return <p>Error</p>

	if (!products || products.length === 0)
		return (
			<div>
				<h2 className="mb-3 text-2xl font-semibold">Snowboards</h2>
				<p>No products found.</p>
			</div>
		)

	return (
		<div>
			<h2 className="mb-3 text-2xl font-semibold">Snowboards</h2>
			<ul>
				{products.map((product) => (
					<ProductComponent key={product.id} product={product} />
				))}
			</ul>
		</div>
	)
}
