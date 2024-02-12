import { FeaturedProducts } from '@/components/featured-products'
import HeroBannerWithImage from '@/components/layouts/hero-banners/hero-banner-with-image'
import { ContentSection } from '@/components/layouts/shells/content-section'
import { Shell } from '@/components/layouts/shells/shell'

const SkiLodge = () => {
	return (
		<Shell variant="zero-padding" className="max-w-6xl">
			<HeroBannerWithImage
				imgSrc="/images/snowboard-landscape.jpg"
				imgAlt="Snowboarder getting big air in front of a mountain skyline"
			>
				<h1 className="font-heading z-10 text-balance text-3xl text-border text-white sm:text-5xl md:text-6xl lg:text-7xl">
					An e-commerce snowshop built with everything new in Next.js
				</h1>
				<p className="z-10 max-w-[42rem] text-balance leading-normal text-muted-foreground text-white sm:text-xl sm:leading-8">
					Buy and sell snowboarding gear from independent brands and stores
					around the world with ease
				</p>
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

export default SkiLodge