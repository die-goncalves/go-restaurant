import clsx from 'clsx'
import NextLink from 'next/link'
import NextImage from 'next/image'
import {
  AppleLogo,
  FacebookLogo,
  GooglePlayLogo,
  InstagramLogo,
  PinterestLogo,
  TwitterLogo
} from 'phosphor-react'

export function Footer() {
  return (
    <footer className="flex flex-col flex-1 relative px-[3.75rem] z-[2] mt-40">
      <div className="flex items-center justify-between pb-4 border-b-2 border-b-light-gray-200">
        <div className="flex items-center">
          <NextImage src="/logo.svg" alt="pizza" width="32" height="32" />
          &nbsp;
          <span className="text-lg">GoRestaurant</span>
        </div>

        <div className="flex items-center gap-4">
          <NextLink
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

      <div className="flex pt-4 justify-between">
        <div className="flex gap-4">
          <NextLink
            href={'https://play.google.com/store/apps/'}
            className={clsx(
              'flex items-center h-max py-2 px-4 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
              'transition-[background-color, outline] ease-in duration-150',
              'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
            )}
          >
            <GooglePlayLogo className="w-6 h-6 text-light-gray-800" />
            <div className="flex flex-col ml-4 items-start">
              <span className="text-sm">DISPONÍVEL NO</span>
              <span>Google Play</span>
            </div>
          </NextLink>

          <NextLink
            href={'https://www.apple.com/app-store/'}
            className={clsx(
              'flex items-center h-max py-2 px-4 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
              'transition-[background-color, outline] ease-in duration-150',
              'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
            )}
          >
            <AppleLogo className="w-6 h-6 text-light-gray-800" />
            <div className="flex flex-col ml-4 items-start">
              <span className="text-sm">Disponível na</span>
              <span>App Store</span>
            </div>
          </NextLink>
        </div>

        <div className="flex flex-col items-end">
          <span>©2023 GoRestaurant</span>

          <span>
            Website criado por
            <NextLink
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
