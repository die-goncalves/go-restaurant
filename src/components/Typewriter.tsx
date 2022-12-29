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
    <strong className="text-4xl font-medium">
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
