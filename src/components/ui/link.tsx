import NextLink from 'next/link'
import { type ComponentProps } from 'react'
import { ArrowOutwardIcon } from '@/src/components/icons/arrow-outward'
import { css, cx } from '@/styled-system/css'
import { type LinkVariantProps, link } from '@/styled-system/recipes/link'

/** Safe rel attribute value for every external link. */
const EXTERNAL_REL = 'noopener noreferrer'

type LinkProps = ComponentProps<typeof NextLink> &
  LinkVariantProps & {
    /**
     * When `true`, renders an external-link icon after the children and
     * automatically sets `target="_blank"` + `rel="noopener noreferrer"`.
     */
    external?: boolean
    /**
     * Explicitly suppresses the external icon.
     *
     * @example
     * <Link href="..." external hideIcon>
     *   <GooglePlayBadge />
     * </Link>
     */
    hideIcon?: boolean
  }

/**
 * Thin wrapper around `next/link` that integrates with Panda CSS recipes and
 * adds optional external-link behaviour.
 *
 * @example
 * // Internal link
 * <Link href="/about" underline italic>About us</Link>
 *
 * @example
 * // External link – opens in new tab automatically
 * <Link href="https://example.com" external>Visit site</Link>
 */
export function Link(linkProps: LinkProps) {
  const {
    children,
    className,
    external = false,
    hideIcon = false,
    italic,
    underline,
    rel,
    target,
    ...rest
  } = linkProps

  const resolvedTarget = target ?? (external ? '_blank' : undefined)
  const resolvedRel = rel ?? (external ? EXTERNAL_REL : undefined)

  const showIcon = hideIcon ? false : external ? true : false

  const composedClassName = cx(link({ underline, italic }), className)

  return (
    <NextLink
      {...rest}
      target={resolvedTarget}
      rel={resolvedRel}
      className={composedClassName}
    >
      {children}
      {showIcon && (
        <span
          className={css({
            display: 'inline-flex',
            alignItems: 'start',
            marginLeft: '0.5',
            flexShrink: 0
          })}
        >
          <ArrowOutwardIcon
            className={css({
              width: '3',
              height: '3'
            })}
          />
        </span>
      )}
    </NextLink>
  )
}
