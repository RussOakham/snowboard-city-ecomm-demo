import { type EmblaOptionsType } from 'embla-carousel'
import Image from 'next/image'

import { type Image as ShopifyImage } from '@/lib/shopify/types/shopify'
import { cn } from '@/lib/utils'

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from './ui/carousel'
import { Icons } from './icons'

interface ProductImageCarouselProps
	extends React.HTMLAttributes<HTMLDivElement> {
	images: ShopifyImage[]
	options?: EmblaOptionsType
}

export function ProductImageCarousel({
	images,
	options,
	className,
	...props
}: ProductImageCarouselProps) {
	if (images.length === 0) {
		return (
			<div
				aria-label="Product Placeholder"
				className="flex aspect-square size-full flex-1 items-center justify-center bg-secondary"
			>
				<Icons.Placeholder
					className="size-9 text-muted-foreground"
					aria-hidden="true"
				/>
			</div>
		)
	}

	const carouselOptions: EmblaOptionsType = {
		...options,
		active: images.length > 1,
	}

	return (
		<div
			aria-label="product-image-carousel"
			className={cn('flex flex-col gap-2', className)}
			{...props}
		>
			<Carousel opts={carouselOptions}>
				<CarouselContent>
					{images.length > 1 ? <CarouselPrevious /> : null}
					{images.map((image, index) => {
						return (
							<CarouselItem key={image.url}>
								<div
									className="relative aspect-square min-w-0 flex-[0_0_100%] pl-4"
									key={image.url}
								>
									<Image
										aria-label={`Slide ${index + 1} of ${images.length}`}
										key={image.url}
										aria-roledescription="slide"
										src={image.url}
										alt={image.altText}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										className="object-cover"
										priority={index === 0}
									/>
								</div>
							</CarouselItem>
						)
					})}
					{images.length > 1 ? <CarouselNext /> : null}
				</CarouselContent>
			</Carousel>
		</div>
	)
}
