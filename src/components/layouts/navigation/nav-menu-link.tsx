'use client'

import Link from 'next/link'

import {
	NavigationMenuItem,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { MainNavItem } from '@/types'

interface NavMenuLinkProps {
	item: MainNavItem
}

const NavMenuLink = ({ item }: NavMenuLinkProps) => {
	return (
		<NavigationMenuItem key={item.title}>
			<Link href={item.href as string} legacyBehavior passHref>
				<NavigationMenuLink className={navigationMenuTriggerStyle()}>
					{item.title}
				</NavigationMenuLink>
			</Link>
		</NavigationMenuItem>
	)
}

export default NavMenuLink
