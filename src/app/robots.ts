import { absoluteUrl } from '@/lib/utils'

export default function robots() {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: '/preview',
			},
		],
		sitemap: absoluteUrl('/sitemap.xml'),
		host: absoluteUrl(),
	}
}
