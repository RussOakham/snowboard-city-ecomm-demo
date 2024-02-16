'use client'

import { EnterFullScreenIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { DialogShell } from '@/components/layouts/shells/dialog-shell'
import { PlaceholderImage } from '@/components/placeholder-image'
import { Rating } from '@/components/rating'
import { AlertDialogAction } from '@/components/ui/alert-dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { buttonVariants } from '@/components/ui/button'
import { useGetProductQuery } from '@/lib/react-query/queries/useGetProductQuery'
import { cn, formatPrice } from '@/lib/utils'

interface ProductModalPageProps {
	params: {
		productHandle: string
	}
}

export default function ProductModalPage({ params }: ProductModalPageProps) {
	const [product] = useGetProductQuery(params.productHandle)

	if (!product) {
		notFound()
	}

	// Mock product rating as not included in vanilla shopify product data
	const productRating = Math.floor(Math.random() * 5) + 1

	return (
		<DialogShell className="flex flex-col gap-2 overflow-visible sm:flex-row">
			<AlertDialogAction
				className={cn(
					buttonVariants({
						variant: 'ghost',
						size: 'icon',
						className:
							'absolute right-10 top-4 h-auto w-auto shrink-0 rounded-sm bg-transparent p-0 text-foreground opacity-70 ring-offset-background transition-opacity hover:bg-transparent hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
					}),
				)}
				asChild
			>
				<Link href={`/product/${product.handle}`} replace>
					<EnterFullScreenIcon className="size-4" aria-hidden="true" />
				</Link>
			</AlertDialogAction>
			<AspectRatio ratio={16 / 9} className="w-full">
				{product.featuredImage ? (
					<Image
						src={
							product.featuredImage.url ?? '/images/product-placeholder.webp'
						}
						alt={product.featuredImage.altText ?? product.handle}
						className="object-cover"
						sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
						fill
						loading="lazy"
					/>
				) : (
					<PlaceholderImage className="rounded-none" asChild />
				)}
			</AspectRatio>
			<div className="space-6-6 w-full p-6 sm:p-10">
				<div className="space-y-2">
					<h1 className="line-clamp-2 text-2xl font-bold">{product.handle}</h1>
					<p className="text-base text-muted-foreground">
						{formatPrice(product.priceRange.minVariantPrice.amount)}
					</p>
					<Rating rating={productRating} />
					<p className="text-base text-muted-foreground">
						{product.totalInventory} in stock
					</p>
				</div>
				<p className="line-clamp-4 text-base text-muted-foreground">
					{product.description}
				</p>
			</div>
		</DialogShell>
	)
}
