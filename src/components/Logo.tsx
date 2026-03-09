import NextLink from 'next/link'
import NextImage from 'next/image'
import { shimmerBase64 } from '../utils/blurDataURL'
import { css } from '@/styled-system/css'

type LogoProps = {
  named?: boolean
}
export function Logo({ named = false }: LogoProps) {
  return (
    <NextLink
      href="/"
      className={`group ${css({
        display: 'flex',
        gap: '2'
      })}`}
      title="GoRestaurant"
    >
      <div
        className={css({
          position: 'relative',
          w: '8',
          h: '8',
          transition: 'all 150ms ease-in',
          ...(!named && {
            _hover: { transform: 'scale(2)' }
          })
        })}
      >
        <NextImage
          src="/logo.svg"
          alt="pizza"
          fill
          className={css({ objectFit: 'contain' })}
          placeholder="blur"
          blurDataURL={shimmerBase64}
          sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
        />
      </div>
      {named && (
        <span
          className={css({
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            fontSize: 'lg',
            color: 'gray.800',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom',
            backgroundSize: 'auto 2px',
            backgroundImage:
              'linear-gradient(to right, token(colors.light.orange.500), token(colors.light.orange.200))',
            transition: 'all 150ms ease-in',
            _groupHover: { backgroundSize: 'auto 4px' }
          })}
        >
          GoRestaurant
        </span>
      )}
    </NextLink>
  )
}
