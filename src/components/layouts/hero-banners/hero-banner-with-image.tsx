import Image from 'next/image'

import { Shell } from '@/components/layouts/shells/shell'

interface HeroBannerWithImageProps {
	children: React.ReactNode
	imgAlt: string
	imgSrc: string
}

const HeroBannerWithImage = ({
	children,
	imgAlt,
	imgSrc,
}: HeroBannerWithImageProps) => {
	return (
		<Shell className="h-[350px] max-w-6xl p-0 md:h-[500px] md:p-0 lg:h-[750px]">
			<Image
				src={imgSrc}
				alt={imgAlt}
				className="absolute inset-0 z-0 mt-16 aspect-video h-[350px] w-full object-cover md:h-[500px] lg:h-[750px]"
				width={1440}
				height={810}
				priority
			/>
			<section className="relative mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center gap-4 text-center">
				<div className="full-bleed absolute h-full opacity-25" />
				{children}
			</section>
		</Shell>
	)
}

export default HeroBannerWithImage
