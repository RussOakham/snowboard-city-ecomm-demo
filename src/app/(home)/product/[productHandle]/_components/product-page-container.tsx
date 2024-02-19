'use client'

import { notFound } from 'next/navigation'

import { AddToCartForm } from '@/components/forms/add-to-cart-form'
import { Breadcrumbs } from '@/components/pagers/breadcrumbs'
import { ProductImageCarousel } from '@/components/product-image-carousel'
import { Rating } from '@/components/rating'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { useGetProductQuery } from '@/lib/react-query/queries/useGetProductQuery'
import { formatPrice, toTitleCase } from '@/lib/utils'

import { VariantSelector } from './variant-selector'

interface ProductPageContainerProps {
	params: {
		productHandle: string
	}
}

export function ProductPageContainer({ params }: ProductPageContainerProps) {
	const [product] = useGetProductQuery(params.productHandle)

	// Mock product rating as not included in vanilla shopify product data
	const productRating = Math.floor(Math.random() * 5) + 1

	if (!product) {
		return notFound()
	}

	return (
		<>
			<Breadcrumbs
				segments={[
					{
						title: 'Products',
						href: '/products',
					},
					{
						title: `${toTitleCase(product.productType)}`,
						href: `/categories/${product.productType}`,
					},
					{
						title: product.title,
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
					<Separator className="mt-4 md:hidden" />
					<p className="text-base text-muted-foreground">
						{product.totalInventory} in stock
					</p>
					<div className="flex items-center justify-between">
						<Rating rating={productRating} />
					</div>
					<Separator className="mt-4 md:hidden" />
					<VariantSelector
						options={product.options}
						variants={product.variants}
					/>
					<Separator className="mt-4 md:hidden" />
					<AddToCartForm
						product={product}
						availableForSale={product.availableForSale}
						showBuyNow
					/>
					<Separator className="mt-4 md:hidden" />
					<Accordion
						type="single"
						collapsible
						className="w-full"
						defaultValue="description"
					>
						<AccordionItem value="description" className="border-none">
							<AccordionTrigger>Description</AccordionTrigger>
							<AccordionContent>
								{product.description.length > 0
									? product.description
									: 'No description is available for this product.'}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Separator className="md:hidden" />
				</div>
			</div>
		</>
	)
}
