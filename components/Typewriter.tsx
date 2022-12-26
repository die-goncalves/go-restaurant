import { Typewriter as RST } from 'react-simple-typewriter'

const phrases = [
  'Trabalhou até tarde?',
  'Encontro com amigos?',
  'Não está a fim de cozinhar?',
  'Está com fome, mas não está em casa?',
  'Maratonando sua série favorita?'
]

export function Typewriter() {
  return (
    <strong className="text-4xl font-medium">
      <RST
        words={phrases}
        loop={false}
        cursor
        cursorStyle="|"
        typeSpeed={70}
        deleteSpeed={35}
        delaySpeed={1000}
      />
    </strong>
  )
}
