'use client'

import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { MainNavItem } from '@/types'

import { Icons } from '../../icons'
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '../../ui/navigation-menu'

import { ListItem } from './nav-list-item'

interface MainNavProps {
	items?: MainNavItem[]
}

export default function MainNav({ items }: MainNavProps) {
	return (
		<div className="hidden gap-6 lg:flex">
			<Link href="/" className="hidden items-center space-x-2 lg:flex">
				<Icons.Snowboarder className="size-6" aria-hidden="true" />
				<span className="hidden font-bold lg:inline-block">
					{siteConfig.name}
				</span>
				<span className="sr-only">Home</span>
			</Link>
			<NavigationMenu>
				<NavigationMenuList>
					{items?.[0]?.items ? (
						<NavigationMenuItem>
							<NavigationMenuTrigger className="h-auto">
								{items[0].title}
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
									<li className="row-span-3">
										<NavigationMenuLink asChild>
											<Link
												href="/"
												className="flex size-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
											>
												<Icons.Snowboarder
													className="size-6"
													aria-hidden="true"
												/>
												<div className="mb-2 mt-4 text-lg font-medium">
													{siteConfig.name}
												</div>
												<p className="text-sm leading-tight text-muted-foreground">
													{siteConfig.description}
												</p>
												<span className="sr-only">Home</span>
											</Link>
										</NavigationMenuLink>
									</li>
									{items[0].items.map((item) => (
										<ListItem
											key={item.title}
											title={item.title}
											href={item.href}
										>
											{item.description}
										</ListItem>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
					) : null}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	)
}
