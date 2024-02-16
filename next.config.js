/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3000',
			},
			{
				protocol: 'https',
				hostname: 'cdn.shopify.com',
			},
		],
	},
	experimental: {
		typedRoutes: true,
		webVitalsAttribution: ['CLS', 'FCP', 'FID', 'LCP', 'TTFB'],
	},
}

module.exports = nextConfig
