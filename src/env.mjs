import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	/*
	 * Serverside Environment variables, not available on the client.
	 * Will throw if you access these variables on the client.
	 */
	server: {
		SHOPIFY_REVALIDATION_SECRET: z.string().optional(),
	},
	/*
	 * Environment variables available on the client (and server).
	 *
	 * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
	 */
	client: {
		NEXT_PUBLIC_VERCEL_URL: z.string().url(),
		NEXT_PUBLIC_COMPANY_NAME: z.string().min(1),
		NEXT_PUBLIC_TWITTER_CREATOR: z.string(),
		NEXT_PUBLIC_TWITTER_SITE: z.string().url(),
		NEXT_PUBLIC_SITE_NAME: z.string().min(1),
		NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string().min(1),
		NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: z.string().min(1),
	},
	/*
	 * Due to how Next.js bundles environment variables on Edge and Client,
	 * we need to manually destructure them to make sure all are included in bundle.
	 *
	 * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
	 */
	runtimeEnv: {
		NEXT_PUBLIC_VERCEL_URL: 'http://localhost:3000',
		NEXT_PUBLIC_COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME,
		NEXT_PUBLIC_TWITTER_CREATOR: process.env.NEXT_PUBLIC_TWITTER_CREATOR,
		NEXT_PUBLIC_TWITTER_SITE: process.env.NEXT_PUBLIC_TWITTER_SITE,
		NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
		NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN:
			process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
		NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:
			process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
	},
})
