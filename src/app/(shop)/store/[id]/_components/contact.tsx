import { CallIcon } from '@/src/components/icons/call'
import { css } from '@/styled-system/css'

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')

  if (digits.length === 11) {
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }

  if (digits.length === 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  }

  return phone
}

export function Contact({ phoneNumber }: { phoneNumber: string | null }) {
  const phone = phoneNumber
    ? formatPhone(phoneNumber)
    : 'Sem telefone cadastrado'
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        gap: '2',
        color: 'surface.on'
      })}
    >
      <div className={css({ alignSelf: 'start' })}>
        <div
          className={css({
            height: '10',
            minWidth: '10',
            display: 'inline-flex',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center'
          })}
        >
          <CallIcon className={css({ width: '5', height: '5' })} />
        </div>
      </div>
      <p>{phone}</p>
    </div>
  )
}
