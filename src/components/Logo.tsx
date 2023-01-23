import NextLink from 'next/link'
import NextImage from 'next/image'
import { shimmerBase64 } from '../utils/blurDataURL'
import clsx from 'clsx'

type LogoProps = {
  named?: boolean
}
export function Logo({ named = false }: LogoProps) {
  return (
    <NextLink href={'/'} className="group flex gap-2" title="GoRestaurant">
      <div
        className={clsx(
          'relative w-8 h-8 transition-all duration-150 ease-in',
          !named ? 'hover:scale-110' : ''
        )}
      >
        <NextImage
          src="/logo.svg"
          alt="pizza"
          fill
          className="object-contain"
          placeholder="blur"
          blurDataURL={shimmerBase64}
          sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
        />
      </div>
      {named && (
        <span className="flex items-center relative text-lg text-gray-800 bg-no-repeat bg-bottom bg-[length:auto_2px] group-hover:bg-[length:auto_4px] bg-gradient-to-r from-light-orange-500 to-light-orange-200 transition-all duration-150 ease-in">
          GoRestaurant
        </span>
      )}
    </NextLink>
  )
}
