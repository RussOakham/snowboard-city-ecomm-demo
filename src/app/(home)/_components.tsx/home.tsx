import Link from 'next/link'

import { FeaturedProducts } from '@/components/featured-products'
import HeroBannerWithImage from '@/components/layouts/hero-banners/hero-banner-with-image'
import { ContentSection } from '@/components/layouts/shells/content-section'
import { Shell } from '@/components/layouts/shells/shell'
import { Button } from '@/components/ui/button'

const Home = () => {
	return (
		<Shell variant="zero-vertical-padding" className="max-w-6xl">
			<HeroBannerWithImage
				imgSrc="/images/snowboard-landscape.jpg"
				imgAlt="Snowboarder getting big air in front of a mountain skyline"
			>
				<h1 className="z-10 text-balance font-heading text-3xl text-border text-white sm:text-5xl md:text-6xl lg:text-7xl">
					An e-commerce snowshop built with everything new in Next.js
				</h1>
				<p className="z-10 max-w-[42rem] text-balance leading-normal text-muted-foreground text-white sm:text-xl sm:leading-8">
					Buy and sell snowboarding gear from independent brands and stores
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
			</HeroBannerWithImage>
			<ContentSection
				title="Featured products"
				description="Explore our wide range of products"
				href="/products"
				linkText="View all products"
				className="pt-8 md:pt-10 lg:pt-12"
			>
				<FeaturedProducts />
			</ContentSection>
		</Shell>
	)
}

export default Home
