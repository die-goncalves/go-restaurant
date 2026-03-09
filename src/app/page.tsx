'use client'

import Head from 'next/head'
import NextImage from 'next/image'
import { shimmerBase64 } from '../utils/blurDataURL'
import { Account } from '../components/account'
import { SignedUser } from '../components/signed-user'
import { DrawerMap } from '../components/drawer-map'
import { Typewriter } from '../components/typewriter'
import { Searchbox } from '../components/search-box'
import { Skeleton } from '../components/skeleton'
import { useAuth } from '../contexts/auth-context'
import { Partners } from '../components/partner'
import { Footer } from '../components/footer'
import { Help } from '../components/help'
import { Presentation } from '../components/presentation'
import { Logo } from '../components/logo'
import { css } from '@/styled-system/css'

export default function Home() {
  const { isLoading, session } = useAuth()

  console.log({ isLoading, session })
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        bg: 'light.gray.100',
        mx: 'auto',
        maxW: '1920px',
        pb: '8'
      })}
    >
      <Head>
        <title>Página inicial | GoRestaurant</title>
      </Head>

      <Presentation />

      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          h: 'screen',
          '2xs': { h: '80vh' },
          xs: { h: '60vh' },
          sm: { h: 'screen' },
          md: { h: '60vh' },
          lg: { h: 'screen', flexDirection: 'row' }
        })}
      >
        <div
          className={css({
            w: 'full',
            lg: { w: '60%' }
          })}
        >
          <header
            className={css({
              display: 'flex',
              p: '4',
              alignItems: 'center',
              justifyContent: 'space-between',
              bg: 'light.gray.100',
              sm: { px: '6' },
              lg: { px: '8' }
            })}
          >
            <Logo named />

            {isLoading ? (
              <Skeleton className={css({ h: '10', w: '48' })} />
            ) : session ? (
              <SignedUser />
            ) : (
              <Account />
            )}
          </header>

          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              px: '4',
              mt: '4',
              sm: { px: '6', mt: '6' },
              lg: { px: '8', mt: '8' }
            })}
          >
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '4',
                alignItems: 'start'
              })}
            >
              <Typewriter />

              <p
                className={css({
                  fontSize: '2xl',
                  fontWeight: 'regular'
                })}
              >
                Faça pedidos de suas comidas favoritas em restaurantes perto de
                você
              </p>
            </div>

            <div
              className={css({
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                mt: '8',
                mb: '2',
                gap: '1',
                sm: { gap: '2' }
              })}
            >
              <Searchbox />
              <DrawerMap />
            </div>
          </div>
        </div>

        <div
          className={css({
            position: 'relative',
            w: 'full',
            h: 'full',
            opacity: '0.9',
            lg: { w: '40%', h: 'screen' }
          })}
        >
          <div
            className={css({
              position: 'absolute',
              w: 'full',
              h: '1/3',
              bg: 'white/10',
              zIndex: '1',
              backgroundImage:
                'linear-gradient(to bottom, token(colors.light.gray.100), transparent)',
              lg: { display: 'none' }
            })}
          />

          <NextImage
            className={css({ objectFit: 'cover' })}
            src="https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Frutas"
            fill
            placeholder="blur"
            blurDataURL={shimmerBase64}
            sizes="(max-width: 768px) 100vw, (min-width: 769px) 80vw"
          />
        </div>
      </div>

      <Partners />
      <Footer />
      <Help />
    </div>
  )
}
