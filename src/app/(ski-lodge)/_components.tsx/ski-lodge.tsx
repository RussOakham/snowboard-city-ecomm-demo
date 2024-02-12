import { Shell } from '@/components/layouts/shells/shell'

const SkiLodge = () => {
	return (
		<Shell className="max-w-6xl">
			<section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
				<h1 className="font-heading text-balance text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
					An e-commerce snowshop built with everything new in Next.js
				</h1>
				<p className="max-w-[42rem] text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8">
					Buy and sell snowboarding gear from independent brands and stores
					around the world with ease
				</p>
			</section>
		</Shell>
	)
}

export default SkiLodge
