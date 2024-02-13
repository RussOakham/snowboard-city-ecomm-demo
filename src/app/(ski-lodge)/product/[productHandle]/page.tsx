'use client'

import { notFound } from 'next/navigation'

import { Shell } from '@/components/layouts/shells/shell'
import { Breadcrumbs } from '@/components/pagers/breadcrumbs'
import { ProductImageCarousel } from '@/components/product-image-carousel'
import { Separator } from '@/components/ui/separator'
import { useGetProductQuery } from '@/lib/react-query/queries/useGetProductQuery'
import { formatPrice } from '@/lib/utils'

interface ProductPageProps {
	params: {
		productHandle: string
	}
}

export default function ProductPage({ params }: ProductPageProps) {
	const [product] = useGetProductQuery(params.productHandle)

	if (!product) {
		return notFound()
	}

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
			<div className="flex flex-col justify-center gap-8 md:flex-row md:gap-16">
				<ProductImageCarousel
					images={product.images ?? []}
					className="w-full md:w-1/2"
					options={{
						loop: true,
					}}
				/>
				<Separator className="mt-4 md:hidden" />
				<div className="flex w-full flex-col gap-4 md:w-1/2">
					<h1 className="line-clamp-1 text-2xl font-bold">{product.title}</h1>
					<p className="text-base text-muted-foreground">
						{formatPrice(product.priceRange.maxVariantPrice.amount)}
					</p>
				</div>
			</div>
		</Shell>
	)
}
