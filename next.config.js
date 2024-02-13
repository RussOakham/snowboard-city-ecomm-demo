/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['localhost', 'cdn.shopify.com'],
	},
	experimental: {
		typedRoutes: true,
		webVitalsAttribution: ['CLS', 'FCP', 'FID', 'LCP', 'TTFB'],
	},
}

module.exports = nextConfig
