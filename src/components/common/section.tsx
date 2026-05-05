import { ReactNode } from 'react'
import { css } from '@/styled-system/css'

export function Section({
  label,
  description,
  children
}: {
  label: string
  description: string
  children: ReactNode
}) {
  const result = label.toLowerCase().replace(/\s+/g, '-')

  return (
    <section
      aria-labelledby={result}
      className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '2'
        })}
      >
        <h2 id={result} className={css({ textStyle: 'xl' })}>
          {label}
        </h2>
        <p>{description}</p>
      </div>

      {children}
    </section>
  )
}
