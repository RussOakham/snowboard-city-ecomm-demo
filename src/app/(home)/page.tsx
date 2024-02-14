import { Suspense } from 'react'

import Home from './_components.tsx/home'
import HomeSkeleton from './_components.tsx/home-skeleton'

export default function IndexPage() {
	return (
		<Suspense fallback={<HomeSkeleton />}>
			<Home />
		</Suspense>
	)
}
