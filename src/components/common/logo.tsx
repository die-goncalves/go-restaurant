import { css, cx } from '@/styled-system/css'
import { PizzaOnAPlateIcon } from '../icons/pizza-on-a-plate'
import { Link } from '../ui/link'

type LogoProps = { withText?: boolean }
export function Logo({ withText = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cx(
        'group',
        css({
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center'
        })
      )}
      title="GoRestaurant"
    >
      <div
        className={css({
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          _icon: {
            width: '10',
            height: '10',
            fill: 'primary.surface.on.variant',
            transitionProperty: 'transform',
            transitionDuration: '350ms',
            transitionTimingFunction: 'token(easings.expressive-fast-spatial)'
          },
          _groupFocus: {
            _icon: {
              transform: 'scale(0.92)',
              transitionDuration: '500ms',
              transitionTimingFunction:
                'token(easings.expressive-default-spatial)'
            }
          },
          _groupHover: {
            _icon: {
              transform: 'scale(0.92)',
              transitionDuration: '500ms',
              transitionTimingFunction:
                'token(easings.expressive-default-spatial)'
            }
          }
        })}
      >
        <PizzaOnAPlateIcon />
      </div>

      {withText && (
        <p
          className={css({
            position: 'relative',
            display: { base: 'none', medium: 'inline-flex' },
            textStyle: 'lg',
            letterSpacing: 0.64,
            marginInline: '0.25em'
          })}
        >
          <span
            className={css({
              fontWeight: 'normal',
              paddingInline: '0.25em',
              background: 'primary',
              color: 'primary.on',
              marginInlineEnd: '0.25em'
            })}
          >
            Go
          </span>
          Restaurant
        </p>
      )}
    </Link>
  )
}
