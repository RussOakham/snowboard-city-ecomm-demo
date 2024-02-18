import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'

import { siteConfig } from '@/config/site'
import { fontHeading, fontMono, fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import Providers from '@/providers/providers'

import './globals.css'

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://snowboard-city.vercel.app/',
	),
	title: {
		default: siteConfig.name,
		template: '%s | Snowboard City',
	},
	description: siteConfig.description,
	keywords: siteConfig.keywords,
	authors: siteConfig.authors,
	creator: siteConfig.authors[0]?.name,
	openGraph: {
		type: 'website',
		locale: 'en_GB',
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
	},
}

interface LayoutProps {
	children: React.ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
	return (
		<html lang="en">
			<body
				className={cn(
					'min-h-screen bg-background font-sans antialiased',
					fontSans.variable,
					fontMono.variable,
					fontHeading.variable,
				)}
				suppressHydrationWarning
			>
				<Providers>
					{children}
					<Analytics />
					<SpeedInsights />
				</Providers>
			</body>
		</html>
	)
}
