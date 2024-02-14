import React from 'react'
import Link from 'next/link'

import { ContentSection } from '@/components/layouts/shells/content-section'
import { Shell } from '@/components/layouts/shells/shell'
import { ProductCardSkeleton } from '@/components/skeletons/product-card-skeleton'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function HomeSkeleton() {
	const id = React.useId()

	return (
		<Shell className="max-w-6xl">
			<section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
				<Skeleton className="h-7 w-44" />
				<Skeleton className="h-7 w-44" />
				<h1 className="text-balance font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
					An e-commerce skateshop built with everything new in Next.js
				</h1>
				<p className="max-w-[42rem] text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8">
					Buy and sell skateboarding gears from independent brands and stores
					around the world with ease
				</p>
				<div className="flex flex-wrap items-center justify-center gap-4">
					<Button asChild>
						<Link href="/products">
							Buy now
							<span className="sr-only">Buy now</span>
						</Link>
					</Button>
				</div>
			</section>
			<ContentSection
				title="Featured products"
				description="Explore products from around the world"
				href="/products"
				linkText="View all products"
				className="pt-8 md:pt-10 lg:pt-12"
			>
				{Array.from({ length: 8 }).map((_, i) => {
					const indexId = `${id}-${i}`

					return <ProductCardSkeleton key={indexId} />
				})}
			</ContentSection>
		</Shell>
	)
}
