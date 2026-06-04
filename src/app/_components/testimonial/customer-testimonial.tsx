'use client'

import NextImage from 'next/image'
import { FormatQuoteIcon } from '@/src/components/icons/format-quote'
import { StarIcon } from '@/src/components/icons/star'
import { Marquee } from '@/src/components/ui/marquee'
import { getStarColor } from '@/src/utils/get-star-color'
import { css } from '@/styled-system/css'

const TESTIMONIAL = [
  {
    stars: 5,
    quote:
      'Sinto que estou pedindo para um vizinho. Cada entrega chega com um cuidado que os outros apps nunca tiveram.',
    name: 'Camila Rocha',
    src: 'https://images.unsplash.com/photo-1636406269177-4827c00bb263?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: 'Professora, Jaguaré'
  },
  {
    stars: 5,
    quote:
      'Não é só sobre velocidade. É sobre saber que o que chega é fresco, caprichado, e que alguém se importou em cada etapa.',
    name: 'Lucas Ferreira',
    src: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: 'Engenheiro, Jaguaré'
  },
  {
    stars: 5,
    quote:
      'Aqui tem aquela sensação de interior: o motoboy me conhece pelo nome, o restaurante lembra do meu pedido preferido. Adoro.',
    name: 'Beatriz Santos',
    src: 'https://images.unsplash.com/photo-1660716040448-6215916d87be?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: 'Designer, São Mateus'
  },
  {
    stars: 5,
    quote:
      'Peço toda semana para o jantar em família. A comida chega sempre no ponto e minha filha já reconhece o som da notificação.',
    name: 'Patrícia Lima',
    src: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: 'Empreendedora, Jaguaré'
  },
  {
    stars: 5,
    quote:
      'Tive um problema no pedido e o atendimento resolveu em minutos, de forma humana, sem chatbot. Isso não tem preço.',
    name: 'Mariana Oliveira',
    src: 'https://images.unsplash.com/photo-1763029949751-a399e5c20916?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: 'Enfermeira, Jaguaré'
  },
  {
    stars: 5,
    quote:
      'Meu restaurante favorito do bairro finalmente chegou até mim. Adoro a curadoria local — sinto que estou apoiando quem é daqui.',
    name: 'Fernanda Lima',
    src: 'https://images.unsplash.com/photo-1656019674844-3040aba0350b?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: 'Professora, Jaguaré'
  },
  {
    stars: 5,
    quote:
      'Fiz meu primeiro pedido com pouco entusiasmo e fiquei completamente surpresa. Embalagem impecável, comida chegou como se tivesse saído agora da cozinha.',
    name: 'Juliano Torres',
    src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: 'Advogado, Jaguaré'
  },
  {
    stars: 5,
    quote:
      'Descobri restaurantes do meu bairro que nem sabia que existiam. Estou explorando a cidade sem sair de casa. Que app incrível.',
    name: 'Letícia Prado',
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: 'Fotógrafa, Jaguaré'
  },
  {
    stars: 5,
    quote:
      'Uso para os almoços do escritório toda semana. A equipe adora a variedade e o delivery chega pontual sempre. Produtividade no topo.',
    name: 'Eduardo Ferreira',
    src: 'https://images.unsplash.com/photo-1688001247541-43bbd88f77b9?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: 'Coordenador, Jaguaré'
  }
]

export function CustomerTestimonial() {
  return (
    <div
      className={css({
        display: 'flex',
        position: 'relative',
        width: '100%'
      })}
    >
      <Marquee.Root
        pauseOnInteraction
        autoFill
        speed={100}
        spacing={'var(--sizes-4)'}
        translations={{ root: 'Depoimentos de clientes' }}
      >
        <Marquee.Viewport>
          <Marquee.Content>
            {TESTIMONIAL.map(t => (
              <Marquee.Item
                key={t.name}
                className={css({
                  position: 'relative',
                  isolation: 'isolate',
                  width: 'clamp(var(--sizes-60), 30dvw, var(--sizes-80))',
                  height: 'min-content',
                  background: 'surface.container',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '4',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  outlineStyle: 'none',
                  outlineWidth: '2px',
                  outlineOffset: '2px',
                  outlineColor: 'transparent',
                  _focus: {
                    outlineStyle: 'solid',
                    outlineColor: 'outline',
                    _after: {
                      background: 'surface.on/10',
                      transitionProperty: 'background',
                      transitionDuration: '200ms',
                      transitionTimingFunction:
                        'token(easings.expressive-default-effects)'
                    }
                  },
                  _hover: {
                    _after: {
                      background: 'surface.on/8',
                      transitionProperty: 'background',
                      transitionDuration: '200ms',
                      transitionTimingFunction:
                        'token(easings.expressive-default-effects)'
                    }
                  },
                  _after: {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    zIndex: -1,
                    background: 'transparent',
                    borderRadius: 'inherit',
                    pointerEvents: 'none',
                    transitionProperty: 'background',
                    transitionDuration: '150ms',
                    transitionTimingFunction:
                      'token(easings.expressive-fast-effects)'
                  }
                })}
                tabIndex={0}
              >
                <div
                  className={css({
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none'
                  })}
                >
                  <div
                    className={css({
                      position: 'relative',
                      width: '14',
                      height: '14',
                      top: '2',
                      left: '2',
                      rotate: '188deg',
                      _icon: {
                        fill: 'primary',
                        opacity: 0.32
                      }
                    })}
                  >
                    <FormatQuoteIcon />
                  </div>
                </div>

                <div
                  className={css({
                    display: 'inline-flex',
                    marginBlockEnd: '2'
                  })}
                >
                  {Array.from({ length: t.stars }).map((star, index) => (
                    <StarIcon
                      key={index}
                      style={{ fill: getStarColor(t.stars) }}
                      className={css({
                        width: '4',
                        height: '4'
                      })}
                    />
                  ))}
                </div>

                <p
                  className={css({
                    fontStyle: 'italic',
                    marginBlockEnd: '4'
                  })}
                >
                  {t.quote}
                </p>

                <div
                  className={css({
                    position: 'relative',
                    display: 'flex',
                    flexShrink: 0,
                    width: '10',
                    height: '10',
                    marginBlockEnd: '4',
                    _before: {
                      content: '""',
                      position: 'absolute',
                      top: '-4px',
                      left: '-4px',
                      width: '50%',
                      height: '50%',
                      borderBlockStartWidth: '2px',
                      borderBlockStartStyle: 'solid',
                      borderBlockStartColor: 'primary',
                      borderInlineStartWidth: '2px',
                      borderInlineStartStyle: 'solid',
                      borderInlineStartColor: 'primary',
                      opacity: 0.64
                    },
                    _after: {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      width: '50%',
                      height: '50%',
                      borderBlockEndWidth: '2px',
                      borderBlockEndStyle: 'solid',
                      borderBlockEndColor: 'primary',
                      borderInlineEndWidth: '2px',
                      borderInlineEndStyle: 'solid',
                      borderInlineEndColor: 'primary',
                      opacity: 0.64
                    }
                  })}
                >
                  <NextImage
                    src={t.src}
                    alt=""
                    className={css({ objectFit: 'cover' })}
                    fill
                  />
                </div>

                <p
                  className={css({
                    textTransform: 'uppercase',
                    textStyle: 'sm',
                    fontWeight: 'bold'
                  })}
                >
                  {t.name}
                </p>

                <p
                  className={css({
                    textStyle: 'sm',
                    color: 'surface.on.variant'
                  })}
                >
                  {t.role}
                </p>
              </Marquee.Item>
            ))}
          </Marquee.Content>
        </Marquee.Viewport>

        <Marquee.Edge side="start" />
        <Marquee.Edge side="end" />
      </Marquee.Root>
    </div>
  )
}
