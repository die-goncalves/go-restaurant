import { forwardRef, ReactNode } from 'react'
import NextLink, { LinkProps } from 'next/link'
import { Item, List, Root } from '@radix-ui/react-navigation-menu'
import { css } from '@/styled-system/css'

type BreadcrumbComponentRootProps = {
  children: ReactNode
}
const BreadcrumbComponentRoot = ({
  children
}: BreadcrumbComponentRootProps) => {
  return (
    <Root>
      <List className={css({ display: 'flex', alignItems: 'baseline' })}>
        {children}
      </List>
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
          className={css({
            fontSize: 'base',
            fontStyle: 'italic',
            sm: { fontSize: 'lg', fontStyle: 'normal' }
          })}
        />
      ) : (
        <NextLink
          ref={forwardedRef}
          {...props}
          className={css({
            fontWeight: 'medium',
            rounded: 'sm',
            transition: 'opacity 150ms ease-in',
            outline: 'none',
            _hover: { opacity: '0.8', textDecoration: 'underline' },
            _focus: {
              outlineStyle: 'solid',
              outlineWidth: '2',
              outlineOffset: '2',
              outlineColor: 'light.indigo.300'
            }
          })}
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
