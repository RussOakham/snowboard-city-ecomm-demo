import { Route } from 'next'
import Link from 'next/link'

import { Icons } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

import { ModeToggle } from '../mode-toggle'
import { Shell } from '../shells/shell'

export function SiteFooter() {
	return (
		<footer className="w-full border-t bg-background">
			<Shell>
				<section
					id="footer-content"
					aria-labelledby="footer-content-heading"
					className="flex flex-col gap-10 lg:flex-row lg:gap-20"
				>
					<section
						id="footer-branding"
						aria-labelledby="footer-branding-heading"
					>
						<Link href="/" className="flex w-fit items-center space-x-2">
							<Icons.Logo className="size-6" aria-hidden="true" />
							<span className="font-bold">{siteConfig.name}</span>
							<span className="sr-only">Home</span>
						</Link>
					</section>

					<section
						id="footer-links"
						aria-labelledby="footer-links-heading"
						className="xxs:grid-cols-2 grid flex-1 grid-cols-1 gap-10 sm:grid-cols-3"
					>
						{siteConfig.footerNav.map((item) => (
							<div key={item.title} className="space-y-3">
								<h4 className="text-base font-medium">{item.title}</h4>
								<ul className="space-y-2.5">
									{item.items.map((link) => (
										<li key={link.title}>
											<Link
												href={link.href as Route}
												target={link.external ? '_blank' : undefined}
												rel={link.external ? 'noreferrer' : undefined}
												className="text-sm text-muted-foreground transition-colors hover:text-foreground"
											>
												{link.title}
												<span className="sr-only">{link.title}</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</section>
					<section
						id="newsletter"
						aria-labelledby="newsletter-heading"
						className="space-y-3"
					>
						<h4 className="text-base font-medium">
							Subscribe to our newsletter
						</h4>
					</section>
				</section>
				<section
					id="footer-bottom"
					aria-labelledby="footer-bottom-heading"
					className="flex items-center space-x-4"
				>
					<div className="flex-1 text-left text-sm leading-loose text-muted-foreground">
						{`Built By `}
						<Link
							href={siteConfig.authors[0]?.twitter as Route}
							target="_blank"
							rel="noreferrer"
							className="font-semibold transition-colors hover:text-foreground"
						>
							{siteConfig.authors[0]?.name}
						</Link>
					</div>
					<div className="flex items-center space-x-1">
						<Link
							href={siteConfig.authors[0]?.github as Route}
							target="_blank"
							rel="noreferrer"
							className={cn(
								buttonVariants({
									size: 'icon',
									variant: 'ghost',
								}),
							)}
						>
							<Icons.GitHub className="size-4" aria-hidden="true" />
							<span className="sr-only">GitHub</span>
						</Link>
						<ModeToggle />
					</div>
				</section>
			</Shell>
		</footer>
	)
}
