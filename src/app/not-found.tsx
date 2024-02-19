import { NotFoundContainer } from '@/components/404-container'
import { SiteFooter } from '@/components/layouts/site-footer'
import { SiteHeader } from '@/components/layouts/site-header'

function NotFoundPage() {
	return (
		<div className="relative flex min-h-screen flex-col">
			<SiteHeader />
			<NotFoundContainer />
			<SiteFooter />
		</div>
	)
}

export default NotFoundPage
