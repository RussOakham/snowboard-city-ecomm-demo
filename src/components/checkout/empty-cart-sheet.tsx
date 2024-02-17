import Link from 'next/link'

import { cn } from '@/lib/utils'

import { Icons } from '../icons'
import { Button, buttonVariants } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'

export function CartSheetEmpty() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					aria-label="Open cart"
					variant="outline"
					size="icon"
					className="relative"
				>
					<Icons.Cart className="size-4" aria-hidden="true" />
				</Button>
			</SheetTrigger>
			<SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
				<div className="flex h-full flex-col items-center justify-center space-y-1">
					<Icons.Cart
						className="mb-4 size-16 text-muted-foreground"
						aria-hidden="true"
					/>
					<div className="text-xl font-medium text-muted-foreground">
						Your cart is empty
					</div>
					<SheetTrigger asChild>
						<Link
							aria-label="Add items to your cart to checkout"
							href="/products"
							className={cn(
								buttonVariants({
									variant: 'link',
									size: 'sm',
									className: 'text-sm text-muted-foreground',
								}),
							)}
						>
							Add items to your cart to checkout
						</Link>
					</SheetTrigger>
				</div>
			</SheetContent>
		</Sheet>
	)
}
