import { css } from '@/styled-system/css'
import { SignUp } from './sign-up'
import { SignIn } from './sign-in'

type LoginClientProps = {
  redirectTo: string
}
export function LoginClient({ redirectTo }: LoginClientProps) {
  return (
    <div
      className={css({
        position: 'relative',
        maxWidth: 'breakpoint-xlarge',
        marginInline: 'auto',
        minHeight: 'calc(100dvh - 72px)',
        background: 'surface',
        display: 'grid',
        gridTemplateColumns: {
          base: 'repeat(4, minmax(0, 1fr))',
          medium: 'repeat(8, minmax(0, 1fr))',
          expanded: 'repeat(12, minmax(0, 1fr))'
        },
        gridAutoRows: 'min-content',
        gridColumnGap: '4',
        gridRowGap: '8',
        padding: { base: '4', medium: '6', expanded: '8' }
      })}
    >
      <div
        className={css({
          gridColumn: {
            base: 'span 4 / span 4',
            medium: 'span 8 / span 8',
            expanded: 'span 12 / span 12'
          }
        })}
      >
        <h1
          className={css({ fontSize: 'xl', expanded: { textAlign: 'center' } })}
        >
          Identificação
        </h1>
      </div>

      <div
        className={css({
          gridColumn: {
            base: 'span 4 / span 4',
            medium: 'span 8 / span 8',
            expanded: 'span 12 / span 12'
          },
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(4, minmax(0, 1fr))',
            medium: 'repeat(8, minmax(0, 1fr))',
            expanded: 'repeat(12, minmax(0, 1fr))'
          },
          gridAutoRows: 'min-content',
          gridColumnGap: '4',
          gridRowGap: '8',
          _after: {
            display: { base: 'none', expanded: 'block' },
            content: '""',
            position: 'absolute',
            height: '100%',
            width: '1px',
            background: 'outline.variant',
            right: '50%',
            transform: 'translate(50%, 0)'
          }
        })}
      >
        <div
          className={css({
            gridColumnStart: { base: 1, expanded: 3 },
            gridColumnEnd: { base: 5, medium: 9, expanded: 7 },
            display: 'flex',
            flexDirection: 'column',
            gap: '4',
            marginInlineEnd: { base: 'unset', expanded: '2', large: '8' }
          })}
        >
          <h2 className={css({ fontSize: 'lg' })}>Tenho cadastro</h2>
          <SignIn redirectTo={redirectTo} />
        </div>

        <div
          className={css({
            gridColumnStart: { base: 1, expanded: 7 },
            gridColumnEnd: { base: 5, medium: 9, expanded: 11 },
            display: 'flex',
            flexDirection: 'column',
            gap: '4',
            marginInlineStart: { base: 'unset', expanded: '2', large: '8' }
          })}
        >
          <h2 className={css({ fontSize: 'lg' })}>Quero me cadastrar</h2>
          <SignUp redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  )
}
