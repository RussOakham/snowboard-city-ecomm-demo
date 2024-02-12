import Image from 'next/image'

import { Shell } from '@/components/layouts/shells/shell'

const SkiLodge = () => {
	return (
		<Shell className="h-[350px] max-w-6xl p-0 md:h-[500px] md:p-0 lg:h-[750px]">
			<Image
				src="/images/snowboard-landscape.jpg"
				alt="Snowboarder getting big air in front of a mountain skyline"
				className="absolute inset-0 z-0 mt-16 aspect-video h-[350px] w-full object-cover md:h-[500px] lg:h-[750px]"
				width={1440}
				height={810}
				priority
			/>
			<section className="relative mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center gap-4 text-center">
				<div className="full-bleed absolute h-full opacity-25" />
				<h1 className="font-heading z-10 text-balance text-3xl text-border text-white sm:text-5xl md:text-6xl lg:text-7xl">
					An e-commerce snowshop built with everything new in Next.js
				</h1>
				<p className="z-10 max-w-[42rem] text-balance leading-normal text-muted-foreground text-white sm:text-xl sm:leading-8">
					Buy and sell snowboarding gear from independent brands and stores
					around the world with ease
				</p>
			</section>
		</Shell>
	)
}

export default SkiLodge
