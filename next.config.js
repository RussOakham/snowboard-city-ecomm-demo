const { withAxiom } = require('next-axiom')

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
			{
				protocol: 'https',
				hostname: 'i.ibb.co',
			},
		],
	},
	experimental: {
		typedRoutes: true,
		webVitalsAttribution: ['CLS', 'FCP', 'FID', 'LCP', 'TTFB'],
	},
}

module.exports = withAxiom(nextConfig)
