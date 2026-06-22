import Image from 'next/image'
import { Link } from '@/src/components/ui/link'
import { css } from '@/styled-system/css'
import BadgeAppleStore from '../icons/app-store.svg'
import BadgeGooglePlay from '../icons/google-play.svg'
import { Logo } from './logo'

export function Footer() {
  return (
    <footer
      className={css({
        maxWidth: 'breakpoint-xlarge',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
        gridTemplateRows: 'repeat(5, minmax(0, min-content))',
        rowGap: '6',
        color: 'surface.on',
        background: 'surface.container',
        marginBlockStart: { base: '8', medium: '12', expanded: '16' },
        marginInline: 'auto',
        padding: { base: '4', medium: '6', expanded: '8' }
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(1, minmax(0, 1fr))',
            medium: 'min-content minmax(0, 1fr)'
          },
          gridTemplateRows: {
            base: 'min-content minmax(0, 1fr)',
            medium: 'repeat(1, minmax(0, 1fr))'
          },
          rowGap: '4'
        })}
      >
        <Logo withText />

        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(1, minmax(0, 1fr))'
          })}
        >
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: { base: 'start', medium: 'end' },
              gap: { base: '4', medium: '6' }
            })}
          >
            <Link
              external
              hideIcon
              href="https://play.google.com/store/apps/"
              className={css({
                position: 'relative',
                display: 'flex',
                width: 'fit-content'
              })}
            >
              <Image
                src={BadgeGooglePlay}
                alt="Baixar na Google Play"
                height={40}
                className={css({ height: '10', flexShrink: 0 })}
              />
            </Link>

            <Link
              external
              hideIcon
              href="https://www.apple.com/app-store/"
              className={css({
                position: 'relative',
                display: 'flex',
                width: 'fit-content'
              })}
            >
              <Image
                src={BadgeAppleStore}
                alt="Baixar na Apple Store"
                height={40}
                className={css({ height: '10', flexShrink: 0 })}
              />
            </Link>
          </div>
        </div>
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(1, minmax(0, 1fr))',
            medium: 'repeat(4, minmax(0, 1fr))'
          },
          gridTemplateRows: {
            base: 'repeat(4, minmax(0, min-content))',
            medium: 'repeat(1, minmax(0, 1fr))'
          },
          columnGap: '6',
          rowGap: '6'
        })}
      >
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '4'
          })}
        >
          <span className={css({ fontFamily: 'sans', opacity: 0.64 })}>
            Parceiros
          </span>
          <ul
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2'
            })}
          >
            <li>
              <Link href="#">Cadastre sua loja</Link>
            </li>
            <li>
              <Link href="#">Portal do parceiro</Link>
            </li>
            <li>
              <Link href="#">Seja entregador</Link>
            </li>
            <li>
              <Link href="#">Anuncie</Link>
            </li>
          </ul>
        </div>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '4'
          })}
        >
          <span className={css({ fontFamily: 'sans', opacity: 0.64 })}>
            Empresa
          </span>
          <ul
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2'
            })}
          >
            <li>
              <Link href="#">Sobre</Link>
            </li>
            <li>
              <Link href="#">Carreiras</Link>
            </li>
            <li>
              <Link href="#">Marca</Link>
            </li>
          </ul>
        </div>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '4'
          })}
        >
          <span className={css({ fontFamily: 'sans', opacity: 0.64 })}>
            Termos e Políticas
          </span>
          <ul
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2'
            })}
          >
            <li>
              <Link href="#">Termos de uso</Link>
            </li>
            <li>
              <Link href="#">Política de Privacidade</Link>
            </li>
            <li>
              <Link href="#">Política de Cookies</Link>
            </li>
          </ul>
        </div>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '4'
          })}
        >
          <span className={css({ fontFamily: 'sans', opacity: 0.64 })}>
            Suporte
          </span>
          <ul
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2'
            })}
          >
            <li>
              <Link href="#">Central de ajuda</Link>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={css({
          display: 'grid',
          gridColumn: 'span 1 / span 1',
          gridTemplateColumns: {
            base: 'repeat(1, minmax(0, 1fr))',
            medium: 'repeat(4, minmax(0, 1fr))'
          },
          gridTemplateRows: 'repeat(1, minmax(0, 1fr))'
        })}
      >
        <div
          className={css({
            gridColumnStart: 1,
            gridColumnEnd: { base: 5, expanded: 4, large: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: '4'
          })}
        >
          <span className={css({ fontFamily: 'sans', opacity: 0.64 })}>
            Cidades
          </span>
          <ul>
            {['Jaguaré', 'São Mateus'].map(c => (
              <li
                key={c}
                className={css({
                  display: 'inline',
                  '&:not(:first-child)': {
                    _before: {
                      display: 'inline-block',
                      content: '""',
                      width: '1',
                      height: '1',
                      marginInline: '2',
                      verticalAlign: 'middle',
                      background: 'tertiary'
                    }
                  }
                })}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={css({ gridColumn: 'span 1 / span 1' })}>
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: 'repeat(1, minmax(0, 1fr))',
              medium: 'min-content minmax(0, 1fr)'
            },
            gridTemplateRows: {
              base: 'min-content minmax(0, 1fr)',
              medium: 'repeat(1, minmax(0, 1fr))'
            },
            rowGap: '4'
          })}
        >
          <div
            className={css({
              gridColumn: 'span 1 / span 1',
              display: 'flex',
              justifyContent: { base: 'center', medium: 'start' }
            })}
          >
            <div className={css({ display: 'flex', gap: '4' })}>
              {[
                {
                  href: 'https://www.x.com/',
                  ariaLabel: 'Ver perfil da empresa no X',
                  svg: (
                    <svg
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#1f1f1f"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 714.163,519.284 1160.89,0 H 1055.03 L 667.137,450.887 357.328,0 H 0 L 468.492,681.821 0,1226.37 H 105.866 L 515.491,750.218 842.672,1226.37 H 1200 L 714.137,519.284 Z M 569.165,687.828 521.697,619.934 144.011,79.6944 h 162.604 l 304.797,435.9906 47.468,67.894 396.2,566.721 H 892.476 L 569.165,687.854 Z"
                        transform="matrix(0.6523316,0,0,0.6523316,90.13168,-880)"
                      />
                    </svg>
                  )
                },
                {
                  href: 'https://www.facebook.com/',
                  ariaLabel: 'Ver perfil da empresa no Facebook',
                  svg: (
                    <svg
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#1f1f1f"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="m 0,1.831 c 0,-138.071 -111.929,-250 -250,-250 -138.071,0 -250,111.929 -250,250 0,117.245 80.715,215.622 189.606,242.638 V 78.227 h -51.552 V 1.831 h 51.552 v -32.919 c 0,-85.092 38.508,-124.532 122.048,-124.532 15.838,0 43.167,3.105 54.347,6.211 v 69.254 c -5.901,-0.621 -16.149,-0.932 -28.882,-0.932 -40.993,0 -56.832,15.528 -56.832,55.9 V 1.831 h 81.659 l -14.028,76.396 h -67.631 V 250 C -95.927,235.049 0,129.649 0,1.831"
                        id="path300"
                        transform="matrix(1.6029336,0,0,1.6029336,881.46684,-482.2016)"
                      />
                    </svg>
                  )
                },
                {
                  href: 'https://www.instagram.com/',
                  ariaLabel: 'Ver perfil da empresa no Instagram',
                  svg: (
                    <svg
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#1f1f1f"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m 314.33794,-877.20216 c -42.5609,2.0075 -71.625,8.8 -97.0326,18.78417 -26.2966,10.2475 -48.5841,24.00001 -70.7608,46.25584 -22.1758,22.25584 -35.8317,44.56001 -46.0075,70.89668 -9.848304,25.46334 -16.519964,54.55167 -18.399964,97.13585 -1.88,42.58417 -2.29667,56.2725 -2.08834,164.89669 0.20834,108.62418 0.68834,122.24085 2.75167,164.91252 2.03246,42.55251 8.79993,71.60834 18.784134,97.02418 10.2642,26.29667 24,48.57667 46.2642,70.76085 22.2641,22.18417 44.5525,35.8075 70.9525,46 25.44,9.831668 54.5358,16.535838 97.1125,18.400008 42.5758,1.86416 56.28,2.29583 164.8725,2.0875 108.5925,-0.2075 122.2642,-0.6875 164.9284,-2.71167 42.6641,-2.02417 71.5683,-8.84 96.9925,-18.775838 26.2958,-10.28833 48.5917,-24 70.76,-46.2725 22.1683,-22.27168 35.8167,-44.59168 45.9842,-70.94418 9.8558,-25.44001 16.5525,-54.53584 18.4,-97.08002 1.8641,-42.69667 2.3041,-56.32834 2.0958,-164.93669 -0.2075,-108.60835 -0.6958,-122.22418 -2.72,-164.88085 -2.0233,-42.65584 -8.8,-71.62418 -18.7758,-97.05585 -10.28,-26.29667 -24,-48.56084 -46.2559,-70.76084 -22.2566,-22.20001 -44.5925,-35.84001 -70.9366,-45.98418 -25.4559,-9.8475 -54.5359,-16.56 -97.1126,-18.4 -42.5758,-1.84 -56.28,-2.31167 -164.9125,-2.10417 -108.6317,0.20834 -122.2325,0.6725 -164.8958,2.7525 m 4.6716,723.10678 c -39,-1.69667 -60.1766,-8.17667 -74.2883,-13.60001 -18.6884,-7.2 -32,-15.90417 -46.0642,-29.8325 -14.0642,-13.92834 -22.7042,-27.28834 -30,-45.93584 -5.48,-14.11251 -12.08,-35.26418 -13.9042,-74.26418 -1.9841,-42.15251 -2.4,-54.80834 -2.6316,-161.60086 -0.2325,-106.79251 0.1758,-119.43251 2.0233,-161.60085 1.6642,-38.96834 8.1842,-60.16835 13.6008,-74.27251 7.2,-18.71167 15.8717,-32.00001 29.8317,-46.05584 13.96,-14.05584 27.28,-22.71167 45.9442,-30.00834 14.0958,-5.50334 35.2483,-12.0475 74.2325,-13.90417 42.1842,-2 54.8242,-2.4 161.6,-2.63167 106.7767,-0.23166 119.4484,0.16834 161.6492,2.02417 38.9675,1.69583 60.1758,8.15167 74.2642,13.6 18.6958,7.2 32,15.84834 46.0558,29.83167 14.0559,13.98417 22.72,27.25667 30.0159,45.96084 5.5125,14.05584 12.0566,35.20001 13.8966,74.20835 2.0075,42.18417 2.4642,54.83167 2.6559,161.60002 0.1916,106.76835 -0.1842,119.44835 -2.0317,161.60086 -1.7042,39 -8.1683,60.18417 -13.6,74.31251 -7.2008,18.68 -15.8808,32 -29.8483,46.0475 -13.9684,14.04834 -27.2725,22.70417 -45.9442,30.00084 -14.08,5.49584 -35.2567,12.05584 -74.2084,13.91167 -42.1841,1.98417 -54.8241,2.4 -161.6408,2.63167 -106.8159,0.2325 -119.4159,-0.2 -161.6,-2.02333 m 326.0808,-539.69008 a 48.000173,48.000173 0 1 0 47.9042,-48.08001 48.000173,48.000173 0 0 0 -47.9042,48.08001 m -370.4817,214.18419 c 0.2242,113.44085 92.3525,205.19337 205.7692,204.9767 113.4159,-0.21583 205.2325,-92.33585 205.0167,-205.7767 -0.2158,-113.44001 -92.3683,-205.21669 -205.8008,-204.99253 -113.4326,0.22417 -205.2009,92.36835 -204.9851,205.79253 m 72.0484,-0.14333 a 133.33648,133.33648 0 1 1 133.6008,133.07252 133.32048,133.32048 0 0 1 -133.6008,-133.07252" />
                    </svg>
                  )
                }
              ].map(({ href, svg, ariaLabel }) => (
                <Link
                  key={href}
                  href={href}
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '10',
                    width: '10'
                  })}
                  external
                  hideIcon
                  aria-label={ariaLabel}
                >
                  {svg}
                </Link>
              ))}
            </div>
          </div>

          <div
            className={css({
              gridColumn: 'span 1 / span 1',
              display: 'flex',
              justifyContent: { base: 'center', medium: 'end' }
            })}
          >
            <div
              className={css({
                gridColumnStart: 4,
                gridColumnEnd: 6,
                alignSelf: 'center',
                justifySelf: 'end',
                textAlign: 'center'
              })}
            >
              <span>© 2026 Go Restaurant. Todos os direitos reservados.</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={css({
          gridColumn: 'span 1 / span 1',
          textAlign: 'center'
        })}
      >
        <span className={css({ display: 'inline-flex' })}>
          Criado por&nbsp;
          <Link href="https://github.com/die-goncalves" external>
            Diego Gonçalves
          </Link>
        </span>
      </div>
    </footer>
  )
}
