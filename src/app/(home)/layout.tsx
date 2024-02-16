import React from 'react'

import SiteHeader from '@/components/layouts/site-header'

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
		</div>
	)
}

export default SkiLodgeLayout
