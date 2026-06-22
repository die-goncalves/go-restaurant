import { Metadata } from 'next'
import { css } from '@/styled-system/css'
import { Footer } from '../components/common/footer'
import { HeaderAuth } from '../components/common/header-auth'
import { Logo } from '../components/common/logo'
import { DirectionsBikeIcon } from '../components/icons/directions-bike'
import { HandshakeIcon } from '../components/icons/handshake'
import { Button } from '../components/ui/button'
import { AddressSelector } from './_components/address-selector'
import { BackgroundAnimation } from './_components/background-animation'
import { Help } from './_components/help'
import { HowItWorks } from './_components/how-it-works'
import { PartnerStores } from './_components/partner-stores'
import { Searchbox } from './_components/searchbox'
import { CustomerTestimonial } from './_components/testimonial/customer-testimonial'
import { OwnerTestimonial } from './_components/testimonial/owner-testimonial'
import { Tour } from './_components/tour'
import { Welcome } from './_components/welcome'

export const metadata: Metadata = {
  title: 'Página inicial | GoRestaurant'
}

export default async function Home() {
  return (
    <div
      className={css({
        maxWidth: 'breakpoint-xlarge',
        marginInline: 'auto',
        minHeight: '100vh',
        background: 'surface'
      })}
    >
      <header
        className={css({
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBlock: '4',
          paddingInline: { base: '4', medium: '6', expanded: '8' }
        })}
      >
        <Logo withText />

        <div
          suppressHydrationWarning
          className={css({ display: 'flex', gap: { base: '2', medium: '4' } })}
        >
          <Tour />

          <Welcome />

          <HeaderAuth />
        </div>
      </header>

      <div
        className={css({
          position: 'relative',
          width: '100%',
          height: 'calc(100dvh - 72px)',
          background: 'surface'
        })}
      >
        <BackgroundAnimation />

        <div
          className={css({
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4',
            width: 'inherit',
            height: 'inherit'
          })}
        >
          <h1
            className={css({
              fontSize: { base: '5xl', medium: '7xl' },
              maxWidth: 'breakpoint-medium',
              textAlign: 'center',
              textWrap: 'pretty',
              fontWeight: 500,
              lineHeight: 1.25
            })}
          >
            Alimentamos o seu dia a dia.
          </h1>

          <p
            className={css({
              textAlign: 'center',
              fontSize: 'lg',
              color: 'surface.on.variant'
            })}
          >
            Mais tempo para você. Simplifique a sua rotina.
          </p>

          <div
            className={css({
              position: 'relative',
              display: 'flex',
              width: '100%',
              flexDirection: 'column',
              gap: '2',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.surface.on.variant'
            })}
          >
            <AddressSelector />

            <div className={css({ width: '52' })}>
              <span
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'center',
                  textStyle: 'sm',
                  color: 'surface.on.variant',
                  _before: {
                    content: '""',
                    flex: 1,
                    marginInlineEnd: '2',
                    borderColor: 'surface.on.variant',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  },
                  _after: {
                    content: '""',
                    flex: 1,
                    marginInlineStart: '2',
                    borderColor: 'surface.on.variant',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }
                })}
              >
                ou
              </span>
            </div>

            <Searchbox />
          </div>
        </div>
      </div>

      <div
        className={css({
          position: 'relative',
          width: '100%',
          paddingInline: { base: '4', medium: '6', expanded: '8' },
          marginBlockEnd: { base: '4', medium: '6', expanded: '8' },
          marginBlockStart: '20'
        })}
      >
        <HowItWorks />
      </div>

      <div
        className={css({
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(1, minmax(0, 1fr))',
            expanded: 'repeat(2, minmax(0, 1fr))'
          },
          gridTemplateRows: {
            base: 'repeat(2, minmax(0, 1fr))',
            expanded: 'minmax(0, 1fr)'
          },
          height: { base: '200dvh', expanded: '100dvh' },
          marginBlockStart: '20',
          '& > div': {
            _first: {
              _after: {
                clipPath: {
                  base: 'polygon(0 100%,100% 0,100% 0)',
                  expanded: 'polygon(0 0,0 100%,100% 100%)'
                }
              }
            },
            _last: {
              _before: {
                clipPath: {
                  base: 'polygon(0 100%,100% 0,100% 0)',
                  expanded: 'polygon(0 0,100% 0%,100% 100%)'
                }
              }
            },
            _before: {
              content: '""',
              height: '5',
              width: '100%',
              top: 0,
              position: 'absolute',
              background: 'primary',
              clipPath: {
                base: 'polygon(0 0,100% 0%,100% 100%)',
                expanded: 'polygon(0 100%,100% 0,100% 0)'
              }
            },
            _after: {
              content: '""',
              height: '5',
              width: '100%',
              bottom: 0,
              position: 'absolute',
              background: 'primary',
              clipPath: {
                base: 'polygon(0 0,0 100%,100% 100%)',
                expanded: 'polygon(0 100%,100% 0,100% 0)'
              }
            }
          }
        })}
      >
        <div
          className={css({
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '10',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 1)), url('https://images.pexels.com/photos/17364662/pexels-photo-17364662.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'surface.inverse.on'
          })}
        >
          <div className={css({ width: '14', height: '14' })}>
            <DirectionsBikeIcon />
          </div>
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '5',
              alignItems: 'center',
              justifyContent: 'center'
            })}
          >
            <h3
              className={css({
                textStyle: '3xl',
                maxWidth: '64',
                textWrap: 'pretty'
              })}
            >
              Faça entregas na sua região
            </h3>
            <p className={css({ maxWidth: '64', textWrap: 'pretty' })}>
              Seja o dono do seu tempo e aumente seus ganhos entregando com a
              gente.
            </p>
            <Button variant="solid">Torne-se um entregador</Button>
          </div>
        </div>

        <div
          className={css({
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '10',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 1)), url('https://images.pexels.com/photos/6205775/pexels-photo-6205775.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'surface.inverse.on'
          })}
        >
          <div className={css({ width: '14', height: '14' })}>
            <HandshakeIcon />
          </div>
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '5',
              alignItems: 'center',
              justifyContent: 'center'
            })}
          >
            <h3
              className={css({
                textStyle: '3xl',
                maxWidth: '64',
                textWrap: 'pretty'
              })}
            >
              Seu negócio merece mais clientes
            </h3>
            <p className={css({ maxWidth: '64', textWrap: 'pretty' })}>
              Aumente seu volume de pedidos e impulsione suas vendas locais com
              a nossa ajuda.
            </p>
            <Button variant="solid">Torne-se um parceiro</Button>
          </div>
        </div>
      </div>

      <div
        className={css({
          position: 'relative',
          width: '100%',
          marginBlockStart: '10'
        })}
      >
        <div className={css({ position: 'relative' })}>
          <PartnerStores />
        </div>
      </div>

      <div
        className={css({
          position: 'relative',
          width: '100%',
          minHeight: '100dvh',
          paddingInline: { base: '4', medium: '6', expanded: '8' },
          marginBlockEnd: { base: '4', medium: '6', expanded: '8' },
          marginBlockStart: '20'
        })}
      >
        <div className={css({ position: 'relative' })}>
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4',
              textAlign: 'center',
              marginInline: 'auto'
            })}
          >
            <h2
              className={css({
                textStyle: '4xl',
                textWrap: 'pretty'
              })}
            >
              A nossa rede apoia a nossa gente.
            </h2>
            <p
              className={css({ textStyle: 'xl', color: 'surface.on.variant' })}
            >
              Cada compra aqui fortalece quem trabalha e vive na sua comunidade.
            </p>
          </div>

          <div
            className={css({
              position: 'relative',
              display: 'flex',
              marginBlockStart: '10',
              marginBlockEnd: '5',
              marginInline: 'auto',
              maxWidth: { base: '100%', medium: '75dvw' }
            })}
          >
            <CustomerTestimonial />
          </div>

          <h3
            className={css({
              textStyle: '3xl',
              textWrap: 'pretty',
              textAlign: 'center',
              marginInline: 'auto'
            })}
          >
            Valorize o que é feito na sua rua.
          </h3>

          <div
            className={css({
              position: 'relative',
              display: 'flex',
              marginBlockStart: '10',
              marginBlockEnd: '5',
              marginInline: 'auto'
            })}
          >
            <OwnerTestimonial />
          </div>
        </div>
      </div>

      <div
        className={css({
          position: 'relative',
          width: '100%',
          marginBlockStart: '20'
        })}
      >
        <Footer />
      </div>

      <Help />
    </div>
  )
}
