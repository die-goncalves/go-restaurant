'use client'

import { css } from '@/styled-system/css'
import TypewriterEffect from 'typewriter-effect'

const phrases = [
  'Trabalhou até tarde?',
  'Encontro com amigos?',
  'Não está a fim de cozinhar?',
  'Está com fome, mas não está em casa?',
  'Maratonando sua série favorita?'
]

export function Typewriter() {
  return (
    <strong
      className={css({
        fontSize: '4xl',
        fontWeight: 'medium'
      })}
    >
      <TypewriterEffect
        options={{
          strings: phrases,
          autoStart: true,
          loop: true,
          deleteSpeed: 35,
          delay: 70,
          cursor: '_'
        }}
      />
    </strong>
  )
}
