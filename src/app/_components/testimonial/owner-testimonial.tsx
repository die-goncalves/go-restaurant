import NextImage from 'next/image'
import { FormatQuoteIcon } from '@/src/components/icons/format-quote'
import { StarIcon } from '@/src/components/icons/star'
import { getStarColor } from '@/src/utils/get-star-color'
import { css } from '@/styled-system/css'

const TESTIMONIAL = [
  {
    stars: 5,
    quote:
      'Finalmente um app que valoriza o restaurante do bairro tanto quanto as grandes redes. Meu negócio cresceu 40% depois que entrei aqui.',
    name: 'Seu Antônio',
    src: 'https://images.unsplash.com/photo-1633625763717-045645e9e739?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    role: 'Pizzaria forneria 1970'
  }
]

export function OwnerTestimonial() {
  return (
    <div
      className={css({
        display: 'flex',
        position: 'relative',
        width: '100%',
        justifyContent: 'center'
      })}
    >
      {TESTIMONIAL.map(t => (
        <div
          key={t.name}
          className={css({
            position: 'relative',
            isolation: 'isolate',
            width: {
              base: '100%',
              medium: 'breakpoint-medium'
            },
            height: 'min-content',
            background: 'surface.container',
            display: 'flex',
            flexDirection: 'column',
            padding: '4',
            alignItems: 'center',
            textAlign: 'center',
            outlineStyle: 'none',
            outlineWidth: '2px',
            outlineOffset: '2px',
            outlineColor: 'transparent',
            _focusVisible: {
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
              transitionTimingFunction: 'token(easings.expressive-fast-effects)'
            }
          })}
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
        </div>
      ))}
    </div>
  )
}
