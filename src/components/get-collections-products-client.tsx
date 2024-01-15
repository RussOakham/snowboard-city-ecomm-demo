'use client'

import { useGetProductsQuery } from '@/lib/react-query/queries/useGetProductsQuery'
import { Product } from '@/lib/shopify/types'

const ProductComponent = ({ product }: { product: Product }) => {
	return <li key={product.id}>{product.title}</li>
}

export const GetCollectionProductsClient = () => {
	const { data: products, isLoading, isError } = useGetProductsQuery()

	if (isLoading) return <p>Loading...</p>

	if (isError) return <p>Error</p>

	return (
		<div>
			<h2 className="mb-3 text-2xl font-semibold">Snowboards</h2>
			<ul>
				{products.map((product) =>
					product ? (
						<ProductComponent key={product.id} product={product} />
					) : null,
				)}
			</ul>
		</div>
	)
}
