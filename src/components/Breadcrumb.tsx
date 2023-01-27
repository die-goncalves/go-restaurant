import { forwardRef, ReactNode } from 'react'
import NextLink, { LinkProps } from 'next/link'
import { Item, List, Root } from '@radix-ui/react-navigation-menu'
import clsx from 'clsx'

type BreadcrumbComponentRootProps = {
  children: ReactNode
}
const BreadcrumbComponentRoot = ({
  children
}: BreadcrumbComponentRootProps) => {
  return (
    <Root>
      <List className="flex items-baseline">{children}</List>
    </Root>
  )
}

type BreadcrumbComponentLinkProps = {
  isHomePage?: boolean
  isCurrentPage?: boolean
  children: ReactNode
} & LinkProps
const BreadcrumbComponentLink = forwardRef<
  HTMLAnchorElement,
  BreadcrumbComponentLinkProps
>(({ isCurrentPage = false, isHomePage = false, ...props }, forwardedRef) => {
  return (
    <Item>
      {!isHomePage ? <span>&nbsp;/&nbsp;</span> : null}
      {isCurrentPage ? (
        <span
          ref={forwardedRef}
          {...props}
          className={clsx('sm:text-lg sm:not-italic', 'text-base italic')}
        />
      ) : (
        <NextLink
          ref={forwardedRef}
          {...props}
          className={clsx(
            'font-medium rounded hover:opacity-80 hover:underline',
            'transition-[opacity, outline] ease-in duration-150',
            'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
          )}
        />
      )}
    </Item>
  )
})

BreadcrumbComponentLink.displayName = 'BreadcrumbLink'

export const Breadcrumb = {
  Root: BreadcrumbComponentRoot,
  Link: BreadcrumbComponentLink
}
