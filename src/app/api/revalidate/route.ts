import { NextRequest, NextResponse } from 'next/server'

import { revalidate } from '@/lib/shopify/revalidate'

export const runtime = 'edge'

export async function POST(req: NextRequest): Promise<NextResponse> {
	return revalidate(req)
}
