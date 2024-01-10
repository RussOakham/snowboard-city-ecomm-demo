import { GetCollectionProducts } from '@/components/get-collection-products';
import { GetCollectionProductsClient } from '@/components/get-collections-products-client';
import { Suspense } from 'react';

export const runtime = 'edge';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Suspense fallback={<p>Loading...</p>}>
        <GetCollectionProducts />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <GetCollectionProductsClient />
      </Suspense>
    </main>
  )
}
