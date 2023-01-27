import clsx from 'clsx'
import NextLink from 'next/link'
import {
  AppleLogo,
  FacebookLogo,
  GooglePlayLogo,
  InstagramLogo,
  PinterestLogo,
  TwitterLogo
} from 'phosphor-react'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer
      className={clsx(
        'lg:px-8 lg:mt-20',
        'sm:px-6',
        'flex flex-col flex-1 relative px-4 z-[2] mt-4'
      )}
    >
      <div
        className={clsx(
          'md:flex-row',
          'flex flex-col gap-4 items-center justify-between pb-4 border-b-2 border-b-light-gray-200'
        )}
      >
        <Logo named />

        <div
          className={clsx('2xs:gap-4', 'grid grid-cols-4 items-center gap-2')}
        >
          <NextLink
            target="_blank"
            href={'https://www.twitter.com/'}
            className={clsx(
              'flex items-center h-max p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
              'transition-[background-color, outline] ease-in duration-150',
              'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
            )}
          >
            <TwitterLogo className="w-6 h-6 text-light-gray-800" />
          </NextLink>
          <NextLink
            target="_blank"
            href={'https://pinterest.com/'}
            className={clsx(
              'flex items-center h-max p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
              'transition-[background-color, outline] ease-in duration-150',
              'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
            )}
          >
            <PinterestLogo className="w-6 h-6 text-light-gray-800" />
          </NextLink>
          <NextLink
            target="_blank"
            href={'https://www.facebook.com/'}
            className={clsx(
              'flex items-center h-max p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
              'transition-[background-color, outline] ease-in duration-150',
              'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
            )}
          >
            <FacebookLogo className="w-6 h-6 text-light-gray-800" />
          </NextLink>
          <NextLink
            target="_blank"
            href={'https://www.instagram.com/'}
            className={clsx(
              'flex items-center h-max p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
              'transition-[background-color, outline] ease-in duration-150',
              'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
            )}
          >
            <InstagramLogo className="w-6 h-6 text-light-gray-800" />
          </NextLink>
        </div>
      </div>

      <div
        className={clsx('md:justify-between md:flex-row', 'flex flex-col pt-4')}
      >
        <div
          className={clsx(
            'lg:gap-4 lg:justify-start',
            '2xs:gap-4',
            'grid grid-cols-2 gap-2 justify-center'
          )}
        >
          <NextLink
            target="_blank"
            href={'https://play.google.com/store/apps/'}
            className={clsx(
              'flex w-fit ml-auto items-center h-max py-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
              'transition-[background-color, outline] ease-in duration-150',
              'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
              'lg:px-4',
              '2xs:px-3',
              'px-2'
            )}
          >
            <GooglePlayLogo className="w-6 h-6 text-light-gray-800" />
            <div className={clsx('lg:ml-4', 'flex flex-col ml-2 items-start')}>
              <span className="text-sm whitespace-nowrap">DISPONÍVEL NO</span>
              <span>Google Play</span>
            </div>
          </NextLink>

          <NextLink
            target="_blank"
            href={'https://www.apple.com/app-store/'}
            className={clsx(
              'flex w-fit items-center h-max py-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
              'transition-[background-color, outline] ease-in duration-150',
              'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
              'lg:px-4',
              'px-3'
            )}
          >
            <AppleLogo className="w-6 h-6 text-light-gray-800" />
            <div className={clsx('lg:ml-4', 'flex flex-col ml-3 items-start')}>
              <span className="text-sm">Disponível na</span>
              <span>App Store</span>
            </div>
          </NextLink>
        </div>

        <div
          className={clsx(
            'md:items-end md:mt-0',
            'flex flex-col items-center mt-4'
          )}
        >
          <span>©2023 GoRestaurant</span>

          <span>
            Website criado por
            <NextLink
              target="_blank"
              href="https://github.com/die-goncalves"
              className={clsx(
                'font-medium ml-2 rounded [&:not(:disabled):hover]:opacity-80',
                'transition-[outline] ease-in duration-150',
                'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
            >
              Diego Gonçalves
            </NextLink>
          </span>
        </div>
      </div>
    </footer>
  )
}
