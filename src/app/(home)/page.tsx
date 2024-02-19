import { Suspense } from 'react'

import Home from './_components/home'
import HomeSkeleton from './_components/home-skeleton'

export default function IndexPage() {
	return (
		<Suspense fallback={<HomeSkeleton />}>
			<Home />
		</Suspense>
	)
}
