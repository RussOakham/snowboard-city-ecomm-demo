import type { FooterItem, MainNavItem } from '@/types'

const links = {
	twitter: 'https://twitter.com/brag___',
	github: 'https://github.com/RussOakham/snowboard-city-ecomm-demo',
	githubAccount: 'https://github.com/RussOakham',
	linkedIn: 'https://www.linkedin.com/in/russell-oakham-11a08585/',
}

export const siteConfig = {
	name: 'Snowboard City',
	description:
		'An open source e-commerce build with everything new in Next.js.',
	url: 'https://snowboard-city-ecomm-demo-hnyjnmx2l-russoakham.vercel.app/',
	// ogImage: 'https://skateshop.sadmn.com/opengraph-image.png',
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
	keywords: [
		'snowboard',
		'ski',
		'snow',
		'winter',
		'outdoor',
		'adventure',
		'ecommerce',
		'open source',
		'next.js',
		'headless',
		'jamstack',
		'shopify',
		'commerce',
	],
	authors: [
		{
			name: 'Russell Oakham',
			twitter: links.twitter,
			github: links.githubAccount,
			linkedId: links.linkedIn,
		},
	],
	footerNav: [
		{
			title: 'Credits',
			items: [
				{
					title: 'Vercel E-Commerce 2.0',
					href: 'https://demo.vercel.store/',
					external: true,
				},
				{
					title: 'Skateshop',
					href: 'https://skateshop.sadmn.com/',
					external: true,
				},
				{
					title: 'Taxonomy',
					href: 'https://tx.shadcn.com/',
					external: true,
				},
				{
					title: 'shadcn/ui',
					href: 'https://ui.shadcn.com',
					external: true,
				},
			],
		},
		{
			title: 'Help',
			items: [
				{
					title: 'About',
					href: '/pages/about',
					external: false,
				},
				{
					title: 'Contact',
					href: '/pages/Contact',
					external: false,
				},
				{
					title: 'Terms',
					href: '/pages/terms',
					external: false,
				},
				{
					title: 'Privacy',
					href: '/pages/privacy',
					external: false,
				},
			],
		},
		{
			title: 'Social',
			items: [
				{
					title: 'Twitter',
					href: links.twitter,
					external: true,
				},
				{
					title: 'GitHub',
					href: links.githubAccount,
					external: true,
				},
				{
					title: 'Github Repo',
					href: links.github,
					external: true,
				},
				{
					title: 'LinkedIn',
					href: links.linkedIn,
					external: true,
				},
			],
		},
	] satisfies FooterItem[],
}
