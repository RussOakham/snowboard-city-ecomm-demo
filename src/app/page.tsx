import { GetCollectionProducts } from '@/components/get-collection-products'

export const runtime = 'edge'

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<GetCollectionProducts />
		</main>
	)
}
