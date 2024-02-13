import { StoredFile } from '@/types'

interface ProductImageCarouselProps
	extends React.HTMLAttributes<HTMLDivElement> {
	images?: StoredFile[]
	options?: CarouselOptions
}

export function ProductImageCarousel({}: ProductImageCarouselProps) {
	return <div>product-image-carousel</div>
}
