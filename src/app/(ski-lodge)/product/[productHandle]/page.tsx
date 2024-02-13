'use client'

import { Shell } from '@/components/layouts/shells/shell'
import { Breadcrumbs } from '@/components/pagers/breadcrumbs'
import { useGetProductQuery } from '@/lib/react-query/queries/useGetProductQuery'

interface ProductPageProps {
	params: {
		productHandle: string
	}
}

export default function ProductPage({ params }: ProductPageProps) {
	const [product] = useGetProductQuery(params.productHandle)

	return (
		<Shell className="pb-12 md:pb-14">
			<Breadcrumbs
				segments={[
					{
						title: 'Products',
						href: '/products',
					},
					{
						title: 'Category',
						href: '/products/category',
					},
					{
						title: params.productHandle,
						href: `/products/${params.productHandle}`,
					},
				]}
			/>
			<div className="flex flex-col gap-8 md:flex-row md:gap-16">
				<h1 className="mb-4 text-2xl font-bold">{product.title}</h1>
			</div>
		</Shell>
	)
}
