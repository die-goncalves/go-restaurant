import { GlobeLocationPinIcon } from '@/src/components/icons/globe-location-pin'
import { MenuBookIcon } from '@/src/components/icons/menu-book'
import { PaymentsIcon } from '@/src/components/icons/payments'
import { StarIcon } from '@/src/components/icons/star'
import { css } from '@/styled-system/css'

const STEPS = [
  {
    number: '01',
    icon: GlobeLocationPinIcon,
    title: 'Escolha o que está perto de você',
    description:
      'Informe seu endereço para ver todos os nossos parceiros que atendem a sua região.',
    tag: 'Por localização'
  },
  {
    number: '02',
    icon: MenuBookIcon,
    title: 'Monte seu pedido sem pressa',
    description:
      'Peça tudo o que você precisa combinando itens de estabelecimentos diferentes em um único pedido.',
    tag: 'Pedido combinado'
  },
  {
    number: '03',
    icon: PaymentsIcon,
    title: 'Pagamento simples e rápido',
    description:
      'Finalize com o seu cartão de forma rápida e segura, sem taxas escondidas.',
    tag: 'Pagamento seguro'
  },
  {
    number: '04',
    icon: StarIcon,
    title: 'Avalie se quiser',
    description: 'Sua opinião melhora a experiência de todo mundo.',
    tag: 'Avaliação honesta'
  }
]

export function HowItWorks() {
  return (
    <div
      className={css({
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      })}
    >
      <div className={css({ marginBlockEnd: '10', textAlign: 'center' })}>
        <p
          className={css({
            textStyle: 'xs',
            textTransform: 'uppercase',
            marginBlockEnd: '3'
          })}
        >
          Como funciona
        </p>
        <h2 className={css({ textStyle: '4xl' })}>Simples do começo ao fim.</h2>
      </div>

      <div
        className={css({
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(1, minmax(0, 1fr))',
            medium: 'repeat(2, minmax(0, 1fr))',
            large: 'repeat(4, minmax(0, 1fr))'
          }
        })}
      >
        {STEPS.map(({ number, icon: Icon, title, description, tag }) => (
          <div
            key={number}
            className={css({
              position: 'relative',
              display: 'flex',
              paddingInline: { base: '0', medium: '6', expanded: '8' },
              paddingBlock: { base: '4', medium: '6', expanded: '8' },
              flexDirection: 'column',
              borderColor: 'outline.variant',
              borderBlockEndWidth: '1px',
              _last: { borderBlockEndWidth: '0px' },
              medium: {
                borderBlockEndWidth: '0px',
                borderInlineEndWidth: '0px',
                _odd: { borderInlineEndWidth: '1px' },
                '&:nth-child(2)': { borderBlockEndWidth: '1px' },
                '&:nth-child(1)': { borderBlockEndWidth: '1px' }
              },
              large: {
                borderBlockEndWidth: '0px',
                borderInlineEndWidth: '1px',
                _last: { borderInlineEndWidth: '0px' },
                '&:nth-child(2)': { borderBlockEndWidth: '0px' },
                '&:nth-child(1)': { borderBlockEndWidth: '0px' }
              }
            })}
          >
            <span
              className={css({
                marginBlockEnd: '4',
                textStyle: 'sm',
                color: 'surface.on.variant',
                width: 'fit-content',
                bg: 'surface',
                marginInline: '-1',
                paddingInline: '1'
              })}
            >
              {number}.
            </span>

            <div
              className={css({
                width: '10',
                height: '10',
                _icon: { width: '5', height: '5' }
              })}
            >
              <Icon />
            </div>

            <h3 className={css({ textStyle: 'xl', marginBlockEnd: '4' })}>
              {title}
            </h3>

            <p className={css({ marginBlockEnd: '4' })}>{description}</p>

            <p
              className={css({
                background: 'secondary.container',
                color: 'secondary.container.on',
                textStyle: 'sm',
                paddingInline: '2',
                width: 'fit-content'
              })}
            >
              {tag}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
