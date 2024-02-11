import type { MainNavItem } from '@/types'

const links = {
	twitter: 'https://twitter.com/sadmann17',
	github: 'https://github.com/sadmann7/skateshop',
	githubAccount: 'https://github.com/sadmann7',
	discord: 'https://discord.com/users/sadmann7',
	calDotCom: 'https://cal.com/sadmann7',
}

export const siteConfig = {
	name: 'Snowboard City',
	description:
		'An open source e-commerce build with everything new in Next.js.',
	url: 'https://skateshop.sadmn.com',
	ogImage: 'https://skateshop.sadmn.com/opengraph-image.png',
	links,
	mainNav: [
		{
			title: 'Ski Lodge',
			items: [
				{
					title: 'Products',
					href: '/products',
					description: 'All the products you need to hit the slopes.',
					items: [],
				},
				{
					title: 'Build a Board',
					href: '/build-a-board',
					description: 'Customize your board to your liking.',
					items: [],
				},
				{
					title: 'About Us',
					href: '/about-us',
					description: 'Learn about our company and our mission.',
					items: [],
				},
			],
		},
	] satisfies MainNavItem[],
}
