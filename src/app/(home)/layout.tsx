import React from 'react'

import { SiteFooter } from '@/components/layouts/site-footer'
import { SiteHeader } from '@/components/layouts/site-header'

interface SkiLodgeLayoutProps
	extends React.PropsWithChildren<{
		modal: React.ReactNode
	}> {}

const SkiLodgeLayout = ({ children, modal }: SkiLodgeLayoutProps) => {
	return (
		<div className="relative flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1">
				{children}
				{modal}
			</main>
			<SiteFooter />
		</div>
	)
}

export default SkiLodgeLayout
