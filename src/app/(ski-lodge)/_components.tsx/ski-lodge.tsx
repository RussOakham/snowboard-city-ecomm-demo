import HeroBannerWithImage from '@/components/layouts/hero-banners/hero-banner-with-image'

const SkiLodge = () => {
	return (
		<HeroBannerWithImage
			imgSrc="/images/snowboard-landscape.jpg"
			imgAlt="Snowboarder getting big air in front of a mountain skyline"
		>
			<h1 className="font-heading z-10 text-balance text-3xl text-border text-white sm:text-5xl md:text-6xl lg:text-7xl">
				An e-commerce snowshop built with everything new in Next.js
			</h1>
			<p className="z-10 max-w-[42rem] text-balance leading-normal text-muted-foreground text-white sm:text-xl sm:leading-8">
				Buy and sell snowboarding gear from independent brands and stores around
				the world with ease
			</p>
		</HeroBannerWithImage>
	)
}

export default SkiLodge
