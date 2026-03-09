'use client'

import NextLink from 'next/link'
import {
  AppleLogo,
  FacebookLogo,
  GooglePlayLogo,
  InstagramLogo,
  PinterestLogo,
  TwitterLogo
} from 'phosphor-react'
import { Logo } from './logo'
import { css } from '@/styled-system/css'

const iconLink = css({
  display: 'flex',
  alignItems: 'center',
  h: 'max',
  p: '2',
  rounded: 'sm',
  bg: 'light.gray.200',
  transition: 'all 150ms ease-in',
  outline: 'none',
  '&:not(:disabled):hover': { bg: 'light.gray.300' },
  _focus: {
    outlineStyle: 'solid',
    outlineWidth: '2',
    outlineOffset: '2',
    outlineColor: 'light.indigo.300'
  }
})

const storeLink = css.raw({
  display: 'flex',
  w: 'fit',
  alignItems: 'center',
  h: 'max',
  py: '2',
  px: '2',
  rounded: 'sm',
  bg: 'light.gray.200',
  transition: 'all 150ms ease-in',
  outline: 'none',
  '&:not(:disabled):hover': { bg: 'light.gray.300' },
  _focus: {
    outlineStyle: 'solid',
    outlineWidth: '2',
    outlineOffset: '2',
    outlineColor: 'light.indigo.300'
  },
  '2xs': { px: '3' },
  lg: { px: '4' }
})

const iconStyle = css({ w: '6', h: '6', color: 'light.gray.800' })

export function Footer() {
  return (
    <footer
      className={css({
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        position: 'relative',
        px: '4',
        zIndex: '2',
        mt: '4',
        sm: { px: '6' },
        lg: { px: '8', mt: '20' }
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: '4',
          borderBottomWidth: '2',
          borderBottomColor: 'light.gray.200',
          md: { flexDirection: 'row' }
        })}
      >
        <Logo named />

        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            alignItems: 'center',
            gap: '2',
            '2xs': { gap: '4' }
          })}
        >
          {[
            { href: 'https://www.twitter.com/', Icon: TwitterLogo },
            { href: 'https://pinterest.com/', Icon: PinterestLogo },
            { href: 'https://www.facebook.com/', Icon: FacebookLogo },
            { href: 'https://www.instagram.com/', Icon: InstagramLogo }
          ].map(({ href, Icon }) => (
            <NextLink
              key={href}
              target="_blank"
              href={href}
              className={iconLink}
            >
              <Icon className={iconStyle} />
            </NextLink>
          ))}
        </div>
      </div>

      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          pt: '4',
          md: { flexDirection: 'row', justifyContent: 'space-between' }
        })}
      >
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '2',
            justifyContent: 'center',
            '2xs': { gap: '4' },
            lg: { gap: '4', justifyContent: 'start' }
          })}
        >
          <NextLink
            target="_blank"
            href={'https://play.google.com/store/apps/'}
            className={css(storeLink, { ml: 'auto' })}
          >
            <GooglePlayLogo className={iconStyle} />
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                ml: '2',
                alignItems: 'start',
                lg: { ml: '4' }
              })}
            >
              <span className={css({ fontSize: 'sm', whiteSpace: 'nowrap' })}>
                DISPONÍVEL NO
              </span>
              <span>Google Play</span>
            </div>
          </NextLink>

          <NextLink
            target="_blank"
            href={'https://www.apple.com/app-store/'}
            className={css(storeLink)}
          >
            <AppleLogo className={iconStyle} />
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                ml: '3',
                alignItems: 'start',
                lg: { ml: '4' }
              })}
            >
              <span className={css({ fontSize: 'sm' })}>Disponível na</span>
              <span>App Store</span>
            </div>
          </NextLink>
        </div>

        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: '4',
            md: { alignItems: 'flex-end', mt: '0' }
          })}
        >
          <span>©2023 - atual GoRestaurant</span>

          <span>
            Website criado por
            <NextLink
              target="_blank"
              href="https://github.com/die-goncalves"
              className={css({
                fontWeight: 'medium',
                ml: '2',
                rounded: 'sm',
                transition: 'all 150ms ease-in',
                outline: 'none',
                '&:not(:disabled):hover': { opacity: '0.8' },
                _focus: {
                  outlineStyle: 'solid',
                  outlineWidth: '2',
                  outlineOffset: '2',
                  outlineColor: 'light.indigo.300'
                }
              })}
            >
              Diego Gonçalves
            </NextLink>
          </span>
        </div>
      </div>
    </footer>
  )
}
