import { siteConfig } from '@/config/site'

import MainNav from '../navigation/main-nav'

const SiteHeader = () => {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background">
			<div className="container flex h-16 items-center">
				<MainNav items={siteConfig.mainNav} />
			</div>
		</header>
	)
}

export default SiteHeader
