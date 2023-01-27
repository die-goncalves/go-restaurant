import clsx from 'clsx'
import { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { X } from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import { shimmerBase64 } from '../utils/blurDataURL'

const gmailSVG = (
  <svg
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    imageRendering="optimizeQuality"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="7.086 7.087 1277.149 924.008"
    preserveAspectRatio="xMinYMin meet"
  >
    <path fill="none" d="M1138.734 931.095h.283M1139.017 931.095h-.283" />
    <path
      d="M1179.439 7.087c57.543 0 104.627 47.083 104.627 104.626v30.331l-145.36 103.833-494.873 340.894L148.96 242.419v688.676h-37.247c-57.543 0-104.627-47.082-104.627-104.625V111.742C7.086 54.198 54.17 7.115 111.713 7.115l532.12 394.525L1179.41 7.115l.029-.028z"
      fill="#e75a4d"
    />
    <linearGradient
      id="a"
      gradientUnits="userSpaceOnUse"
      x1="1959.712"
      y1="737.107"
      x2="26066.213"
      y2="737.107"
      gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"
    >
      <stop offset="0" stopColor="#f8f6ef" />
      <stop offset="1" stopColor="#e7e4d6" />
    </linearGradient>
    <path fill="url(#a)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" />
    <path
      fill="#e7e4d7"
      d="M148.96 242.419v688.676h989.774V245.877L643.833 586.771z"
    />
    <path
      fill="#b8b7ae"
      d="M148.96 931.095l494.873-344.324-2.24-1.586L148.96 923.527z"
    />
    <path fill="#b7b6ad" d="M1138.734 245.877l.283 685.218-495.184-344.324z" />
    <path
      d="M1284.066 142.044l.17 684.51c-2.494 76.082-35.461 103.238-145.219 104.514l-.283-685.219 145.36-103.833-.028.028z"
      fill="#b2392f"
    />
    <linearGradient
      id="b"
      gradientUnits="userSpaceOnUse"
      x1="1959.712"
      y1="737.107"
      x2="26066.213"
      y2="737.107"
      gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"
    >
      <stop offset="0" stopColor="#f8f6ef" />
      <stop offset="1" stopColor="#e7e4d6" />
    </linearGradient>
    <path fill="url(#b)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" />
    <linearGradient
      id="c"
      gradientUnits="userSpaceOnUse"
      x1="1959.712"
      y1="737.107"
      x2="26066.213"
      y2="737.107"
      gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"
    >
      <stop offset="0" stopColor="#f8f6ef" />
      <stop offset="1" stopColor="#e7e4d6" />
    </linearGradient>
    <path fill="url(#c)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" />
    <linearGradient
      id="d"
      gradientUnits="userSpaceOnUse"
      x1="1959.712"
      y1="737.107"
      x2="26066.213"
      y2="737.107"
      gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"
    >
      <stop offset="0" stopColor="#f8f6ef" />
      <stop offset="1" stopColor="#e7e4d6" />
    </linearGradient>
    <path fill="url(#d)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" />
    <linearGradient
      id="e"
      gradientUnits="userSpaceOnUse"
      x1="1959.712"
      y1="737.107"
      x2="26066.213"
      y2="737.107"
      gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"
    >
      <stop offset="0" stopColor="#f8f6ef" />
      <stop offset="1" stopColor="#e7e4d6" />
    </linearGradient>
    <path fill="url(#e)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" />
    <linearGradient
      id="f"
      gradientUnits="userSpaceOnUse"
      x1="1959.712"
      y1="737.107"
      x2="26066.213"
      y2="737.107"
      gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"
    >
      <stop offset="0" stopColor="#f8f6ef" />
      <stop offset="1" stopColor="#e7e4d6" />
    </linearGradient>
    <path fill="url(#f)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" />
    <linearGradient
      id="g"
      gradientUnits="userSpaceOnUse"
      x1="1959.712"
      y1="737.107"
      x2="26066.213"
      y2="737.107"
      gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"
    >
      <stop offset="0" stopColor="#f8f6ef" />
      <stop offset="1" stopColor="#e7e4d6" />
    </linearGradient>
    <path fill="url(#g)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" />
    <linearGradient
      id="h"
      gradientUnits="userSpaceOnUse"
      x1="1959.712"
      y1="737.107"
      x2="26066.213"
      y2="737.107"
      gradientTransform="matrix(.0283 0 0 -.0283 248.36 225.244)"
    >
      <stop offset="0" stopColor="#f8f6ef" />
      <stop offset="1" stopColor="#e7e4d6" />
    </linearGradient>
    <path fill="url(#h)" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" />
    <path fill="#f7f5ed" d="M111.713 7.087l532.12 394.525L1179.439 7.087z" />
  </svg>
)
const githubSVG = (
  <svg
    viewBox="0 0 256 249"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMinYMin meet"
  >
    <g fill="#161614">
      <path d="M127.505 0C57.095 0 0 57.085 0 127.505c0 56.336 36.534 104.13 87.196 120.99 6.372 1.18 8.712-2.766 8.712-6.134 0-3.04-.119-13.085-.173-23.739-35.473 7.713-42.958-15.044-42.958-15.044-5.8-14.738-14.157-18.656-14.157-18.656-11.568-7.914.872-7.752.872-7.752 12.804.9 19.546 13.14 19.546 13.14 11.372 19.493 29.828 13.857 37.104 10.6 1.144-8.242 4.449-13.866 8.095-17.05-28.32-3.225-58.092-14.158-58.092-63.014 0-13.92 4.981-25.295 13.138-34.224-1.324-3.212-5.688-16.18 1.235-33.743 0 0 10.707-3.427 35.073 13.07 10.17-2.826 21.078-4.242 31.914-4.29 10.836.048 21.752 1.464 31.942 4.29 24.337-16.497 35.029-13.07 35.029-13.07 6.94 17.563 2.574 30.531 1.25 33.743 8.175 8.929 13.122 20.303 13.122 34.224 0 48.972-29.828 59.756-58.22 62.912 4.573 3.957 8.648 11.717 8.648 23.612 0 17.06-.148 30.791-.148 34.991 0 3.393 2.295 7.369 8.759 6.117 50.634-16.879 87.122-64.656 87.122-120.973C255.009 57.085 197.922 0 127.505 0" />
      <path d="M47.755 181.634c-.28.633-1.278.823-2.185.389-.925-.416-1.445-1.28-1.145-1.916.275-.652 1.273-.834 2.196-.396.927.415 1.455 1.287 1.134 1.923M54.027 187.23c-.608.564-1.797.302-2.604-.589-.834-.889-.99-2.077-.373-2.65.627-.563 1.78-.3 2.616.59.834.899.996 2.08.36 2.65M58.33 194.39c-.782.543-2.06.034-2.849-1.1-.781-1.133-.781-2.493.017-3.038.792-.545 2.05-.055 2.85 1.07.78 1.153.78 2.513-.019 3.069M65.606 202.683c-.699.77-2.187.564-3.277-.488-1.114-1.028-1.425-2.487-.724-3.258.707-.772 2.204-.555 3.302.488 1.107 1.026 1.445 2.496.7 3.258M75.01 205.483c-.307.998-1.741 1.452-3.185 1.028-1.442-.437-2.386-1.607-2.095-2.616.3-1.005 1.74-1.478 3.195-1.024 1.44.435 2.386 1.596 2.086 2.612M85.714 206.67c.036 1.052-1.189 1.924-2.705 1.943-1.525.033-2.758-.818-2.774-1.852 0-1.062 1.197-1.926 2.721-1.951 1.516-.03 2.758.815 2.758 1.86M96.228 206.267c.182 1.026-.872 2.08-2.377 2.36-1.48.27-2.85-.363-3.039-1.38-.184-1.052.89-2.105 2.367-2.378 1.508-.262 2.857.355 3.049 1.398" />
    </g>
  </svg>
)
const linkedinSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    preserveAspectRatio="xMinYMin meet"
  >
    <g fill="none">
      <path
        d="M0 18.338C0 8.216 8.474 0 18.92 0h218.16C247.53 0 256 8.216 256 18.338v219.327C256 247.79 247.53 256 237.08 256H18.92C8.475 256 0 247.791 0 237.668V18.335z"
        fill="#069"
      />
      <path
        d="M77.796 214.238V98.986H39.488v115.252H77.8zM58.65 83.253c13.356 0 21.671-8.85 21.671-19.91-.25-11.312-8.315-19.915-21.417-19.915-13.111 0-21.674 8.603-21.674 19.914 0 11.06 8.312 19.91 21.169 19.91h.248zM99 214.238h38.305v-64.355c0-3.44.25-6.889 1.262-9.346 2.768-6.885 9.071-14.012 19.656-14.012 13.858 0 19.405 10.568 19.405 26.063v61.65h38.304v-66.082c0-35.399-18.896-51.872-44.099-51.872-20.663 0-29.738 11.549-34.78 19.415h.255V98.99H99.002c.5 10.812-.003 115.252-.003 115.252z"
        fill="#fff"
      />
    </g>
  </svg>
)

export function Presentation() {
  const [open, setOpen] = useState(false)

  function handleClose() {
    const storage = sessionStorage.getItem('@gorestaurant-v0.1.0')
    if (storage) {
      const data = JSON.parse(storage)
      sessionStorage.setItem(
        '@gorestaurant-v0.1.0',
        JSON.stringify({ ...data, presentation: false })
      )
      setOpen(false)
    }
  }

  useEffect(() => {
    const storage = sessionStorage.getItem('@gorestaurant-v0.1.0')
    if (storage) {
      const data = JSON.parse(storage)
      setOpen(data.presentation)
    } else {
      sessionStorage.setItem(
        '@gorestaurant-v0.1.0',
        JSON.stringify({ presentation: true })
      )
      setOpen(true)
    }
  }, [])

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-light-gray-900 fixed inset-0 bg-opacity-75 animate-overlayShow z-20" />
        <Dialog.Content
          className={clsx(
            'fixed flex flex-col rounded bg-light-gray-100 overflow-hidden animate-overlayContent focus:outline-none shadow-xl z-30',
            'lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-auto lg:h-auto',
            'sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-auto',
            'top-2 left-2 w-[calc(100vw-1rem)] max-h-[calc(100vh-1rem)]'
          )}
        >
          <header className="flex p-4 items-center justify-between">
            <p className="text-xl font-medium">Bem vindo!</p>
            <button
              className={clsx(
                'p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                'transition-[background-color, outline] ease-in duration-150',
                'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
              onClick={handleClose}
            >
              <X className="w-6 h-6" />
            </button>
          </header>

          <div className={clsx('overflow-auto')}>
            <p className="pb-4 px-4 text-center">
              Sou Diego Gonçalves e apresento a você o projeto&nbsp;
              <a
                href="https://github.com/die-goncalves/go-restaurant"
                target="_blank"
                rel="noreferrer"
                className="group relative bg-no-repeat bg-bottom bg-[length:auto_2px] hover:bg-[length:auto_4px] bg-gradient-to-r from-light-orange-500 to-light-orange-200 transition-all duration-150 ease-in"
              >
                GoRestaurant
              </a>
            </p>
            <div
              className={clsx('lg:flex-row', 'relative flex flex-col h-max')}
            >
              <div
                className={clsx('lg:w-[450px]', 'md:w-[500px]', 'sm:w-[400px]')}
              >
                <main className="flex flex-col pb-4 px-4 gap-4">
                  <div className="flex gap-8">
                    <div className="flex flex-col gap-4">
                      <p className="text-center">
                        GoRestaurant é uma plataforma que oferece serviço de
                        venda de alimentos pela internet com entrega ou retirada
                        no local.
                      </p>
                      <span className="indent-4 text-justify">
                        O usuário acessa a plataforma, seleciona um local para
                        entrega, a plataforma oferece todos os restaurantes da
                        sua região, o usuário escolhe sua comida favorita, fecha
                        o pedido e então recebe a comida. Também temos um
                        sistema de avaliação de comidas, mas para apenas
                        usuários cadastrados e que já fizeram pedidos. A
                        avaliação é um termômetro indicando os melhores
                        restaurantes e comidas.
                      </span>
                      <a
                        href="https://github.com/die-goncalves/go-restaurant"
                        target="_blank"
                        rel="noreferrer"
                        className={clsx(
                          'flex items-center rounded overflow-hidden h-10 w-full bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                          'transition-[background-color, outline] ease-in duration-150',
                          'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                        )}
                      >
                        <div className="flex flex-none items-center px-2 gap-2 h-full w-28 bg-light-gray-300">
                          <div className="flex items-center w-6 h-6">
                            {githubSVG}
                          </div>
                          <span className="font-medium">Github</span>
                        </div>
                        <span className="px-2 line-clamp-1">
                          die-goncalves/go-restaurant
                        </span>
                      </a>
                    </div>
                  </div>
                </main>

                <footer className="px-4 pb-4">
                  <div className="flex flex-col gap-4">
                    <p className="text-center">Contatos</p>
                    <div className="grid grid-rows-2 grid-cols-1 gap-4">
                      <a
                        href="https://www.linkedin.com/in/diego-goncalves1990"
                        target="_blank"
                        rel="noreferrer"
                        className={clsx(
                          'flex relative items-center rounded overflow-hidden h-10 w-full bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                          'transition-[background-color, outline] ease-in duration-150',
                          'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                        )}
                      >
                        <div className="flex flex-none items-center px-2 gap-2 h-full w-28 bg-light-gray-300">
                          <div className="flex items-center w-6 h-6">
                            {linkedinSVG}
                          </div>
                          <span className="font-medium">Linkedin</span>
                        </div>
                        <span className="px-2 line-clamp-1">
                          diego-goncalves1990
                        </span>
                      </a>

                      <a
                        href="mailto:die.goncalves1990@gmail.com"
                        className={clsx(
                          'flex items-center rounded overflow-hidden h-10 w-full bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                          'transition-[background-color, outline] ease-in duration-150',
                          'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                        )}
                      >
                        <div className="flex flex-none items-center px-2 gap-2 h-full w-28 bg-light-gray-300">
                          <div className="flex items-center w-6 h-6">
                            {gmailSVG}
                          </div>
                          <span className="font-medium">Gmail</span>
                        </div>
                        <span className="px-2 line-clamp-1">
                          die.goncalves1990@gmail.com
                        </span>
                      </a>
                    </div>
                  </div>
                </footer>
              </div>

              <div
                className={clsx(
                  'relative left-0 top-0 bottom-0',
                  'lg:w-[300px] lg:h-auto',
                  'sm:h-60',
                  'h-80'
                )}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <NextImage
                    src="https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
                    alt=""
                    fill
                    className="object-cover contrast-125"
                    placeholder="blur"
                    blurDataURL={shimmerBase64}
                    sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
                  />
                  <div className="flex absolute h-72 w-full overflow-hidden bg-gradient-to-b from-light-gray-100 opacity-100"></div>
                </div>

                <div className="absolute inset-0 z-[1]">
                  <div className="relative flex flex-col gap-4 w-full h-full">
                    <p className="mx-auto text-center max-w-[12rem] font-medium">
                      Plataformas que inspiraram
                    </p>
                    <div className="absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 grid grid-rows-3 grid-cols-1 gap-4 w-36 m-auto">
                      <a
                        href="https://www.ubereats.com/br"
                        target="_blank"
                        rel="noreferrer"
                        className={clsx(
                          'flex rounded h-10 w-full bg-light-gray-100/70 hover:bg-light-gray-100/80',
                          'transition-[background-color, outline] ease-in duration-150',
                          'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                        )}
                      >
                        <div className="h-max w-24 m-auto">
                          <svg
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 134 24"
                            preserveAspectRatio="xMaxYMid meet"
                            fill="none"
                          >
                            <g clipPath="url(#clip0_227_7066)" fill="#000">
                              <path d="M70.629.334H85.72V3.98H74.705v5.215h10.722v3.537H74.705v5.288H85.72v3.647H70.629V.334Zm56.101 21.734c4.627 0 7.234-2.188 7.234-5.215 0-2.151-1.543-3.756-4.774-4.449l-3.415-.693c-1.983-.364-2.607-.729-2.607-1.458 0-.948.955-1.532 2.718-1.532 1.909 0 3.305.51 3.709 2.26h4.002c-.22-3.281-2.607-5.47-7.454-5.47-4.186 0-7.124 1.715-7.124 5.033 0 2.298 1.616 3.793 5.104 4.522l3.819.875c1.505.292 1.909.693 1.909 1.313 0 .985-1.138 1.605-2.974 1.605-2.313 0-3.635-.51-4.149-2.261h-4.04c.588 3.282 3.048 5.47 8.042 5.47Zm-9.124-3.975h-3.011c-.918 0-1.506-.401-1.506-1.24V9.487h4.517V5.913h-4.517V1.428h-4.039v4.485h-3.048v3.574h3.048v8.387c0 2.115 1.505 3.792 4.223 3.792h4.333v-3.573Zm-13.309-12.18v15.754h-4.002v-1.422a7.84 7.84 0 0 1-5.068 1.823c-4.737 0-8.445-3.683-8.445-8.278 0-4.595 3.709-8.278 8.445-8.278a7.84 7.84 0 0 1 5.068 1.824V5.914h4.002Zm-3.929 7.877a4.771 4.771 0 0 0-4.81-4.814 4.795 4.795 0 0 0-4.81 4.814 4.795 4.795 0 0 0 4.81 4.813c2.68 0 4.81-2.115 4.81-4.813ZM8.982 19.167c2.976 0 5.277-2.286 5.277-5.669V.333h3.223v21.332H14.29v-1.98c-1.442 1.492-3.437 2.346-5.677 2.346-4.602 0-8.132-3.322-8.132-8.35V.334h3.223v13.165c0 3.443 2.27 5.668 5.278 5.668Zm10.893 2.498h3.069v-1.95a7.836 7.836 0 0 0 5.584 2.317c4.603 0 8.224-3.627 8.224-8.107 0-4.51-3.62-8.136-8.224-8.136a7.764 7.764 0 0 0-5.554 2.316V.334h-3.1v21.332Zm8.439-2.346a5.377 5.377 0 0 1-5.401-5.394 5.377 5.377 0 0 1 5.4-5.394 5.37 5.37 0 0 1 5.37 5.394c0 2.987-2.423 5.394-5.37 5.394Zm17.705-13.5c-4.572 0-8.04 3.687-8.04 8.075 0 4.632 3.622 8.107 8.316 8.107 2.854 0 5.186-1.25 6.751-3.322l-2.24-1.646c-1.166 1.554-2.7 2.286-4.51 2.286-2.64 0-4.757-1.89-5.187-4.419h12.735v-1.006c0-4.632-3.314-8.075-7.825-8.075Zm-4.848 6.643c.553-2.377 2.486-3.961 4.787-3.961 2.302 0 4.235 1.584 4.757 3.961H41.17ZM63.45 8.866V6.002h-1.074c-1.718 0-2.976.792-3.743 2.042v-1.92h-3.069v15.542h3.1v-8.838c0-2.407 1.472-3.962 3.497-3.962h1.289Z"></path>
                            </g>
                            <defs>
                              <clipPath id="clip0_227_7066">
                                <path
                                  fill="#fff"
                                  transform="translate(.481 .333)"
                                  d="M0 0h133.494v27.429H0z"
                                ></path>
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </a>

                      <a
                        href="https://deliveroo.co.uk/"
                        target="_blank"
                        rel="noreferrer"
                        className={clsx(
                          'flex rounded h-10 w-full bg-light-gray-100/70 hover:bg-light-gray-100/80',
                          'transition-[background-color, outline] ease-in duration-150',
                          'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                        )}
                      >
                        <div className="h-max w-24 m-auto">
                          <svg
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 300 80"
                          >
                            <path
                              d="M116.41 59.926l-1.133-5.28V23.172h-6.542v14.357c-1.968-2.27-4.675-3.6-7.87-3.6-6.545 0-11.61 5.376-11.61 13.27 0 7.895 5.065 13.272 11.61 13.272 3.246 0 6.05-1.383 8.018-3.752l.688 3.207h6.84zm126.18-17.81l3.1-6.956c-1.428-.89-3.1-1.283-4.722-1.283-2.952 0-5.412 1.328-6.985 3.8l-.69-3.21h-6.74l1.082 4.982V59.92h6.54v-16.23c.885-1.677 2.56-2.712 4.723-2.712 1.332.002 2.56.346 3.692 1.135zm8.904 5.08c0-3.946 2.806-6.41 6.59-6.41 3.84 0 6.595 2.464 6.595 6.41 0 3.9-2.756 6.415-6.594 6.415-3.786 0-6.592-2.514-6.592-6.413zm-155.895 0c0-3.946 2.803-6.41 6.59-6.41 3.84 0 6.593 2.464 6.593 6.41 0 3.9-2.754 6.415-6.59 6.415-3.788 0-6.594-2.514-6.594-6.413zm191.462 6.415c-3.787 0-6.59-2.514-6.59-6.413 0-3.947 2.803-6.412 6.59-6.412 3.837 0 6.59 2.465 6.59 6.412 0 3.9-2.753 6.414-6.59 6.414zM138.594 44.88h-12.592c.738-2.91 2.95-4.49 6.295-4.49 3.395 0 5.61 1.58 6.297 4.49zm78.268 0H204.27c.737-2.91 2.95-4.49 6.295-4.49 3.395 0 5.61 1.58 6.297 4.49zm-27.695 15.048l6.84-25.457h-7.134l-5.016 20.622-5.02-20.623h-7.035l6.84 25.455h10.525zm-27.4 0h6.538V34.468h-6.54v25.458zm-18.233-2.44l-2.508-5.623c-2.362 1.233-4.97 1.973-7.626 1.973-3.442 0-5.853-1.332-6.887-3.8h18.397c.197-.936.297-1.873.297-3.008 0-7.894-5.46-13.173-12.79-13.173-7.378 0-12.79 5.33-12.79 13.272 0 8.09 5.362 13.27 13.676 13.27 3.64 0 7.23-.987 10.23-2.91zm143.528-23.56c-7.43 0-12.938 5.377-12.938 13.27 0 7.896 5.51 13.272 12.937 13.272 7.43 0 12.94-5.376 12.94-13.27 0-7.895-5.51-13.272-12.938-13.272zm-65.377 23.63l-2.51-5.625c-2.363 1.234-4.97 1.973-7.627 1.973-3.443 0-5.854-1.33-6.887-3.8h18.4c.197-.936.294-1.873.294-3.007 0-7.894-5.46-13.173-12.79-13.173-7.38 0-12.79 5.327-12.79 13.272 0 8.09 5.363 13.27 13.676 13.27 3.64.003 7.23-.983 10.235-2.908zm49.338-10.36c0-7.893-5.51-13.27-12.938-13.27-7.43 0-12.938 5.377-12.938 13.27 0 7.896 5.51 13.272 12.937 13.272 7.43 0 12.94-5.376 12.94-13.27zM155.91 59.927V23.17h-6.542v36.755h6.542zm13.233-33.108c0-2.368-1.77-4.144-4.082-4.144-2.36 0-4.13 1.776-4.13 4.144 0 2.368 1.77 4.144 4.132 4.144 2.31 0 4.08-1.776 4.08-4.144zM48.916 35.276l-6.39-29.74-20.03 4.215 6.385 29.74L0 45.563 5.1 69.32 55.89 80l11.614-25.813L73.03 2.12 52.66 0l-3.744 35.276zM32.712 51.552c-1.466-.482-2.118-2.237-1.562-4.36.414-1.575 2.362-1.81 3.337-1.828.37-.006.735.068 1.07.218.69.31 1.857.968 2.094 1.973.343 1.45.013 2.667-1.034 3.616-1.05.953-2.434.866-3.904.382zm13.882 1.788c-1.324-.642-1.314-2.277-1.17-3.274.078-.543.298-1.055.642-1.487.473-.594 1.263-1.367 2.175-1.39 1.485-.04 2.762.62 3.483 1.812.724 1.188.362 2.498-.4 3.81-.767 1.307-2.764 1.48-4.73.528z"
                              fill="#00CCBC"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      </a>

                      <a
                        href="https://www.swiggy.com/"
                        target="_blank"
                        rel="noreferrer"
                        className={clsx(
                          'flex rounded h-10 w-full bg-light-gray-100/70 hover:bg-light-gray-100/80',
                          'transition-[background-color, outline] ease-in duration-150',
                          'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                        )}
                      >
                        <div className="h-max w-24 m-auto">
                          <svg
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 201.88 58.77"
                            preserveAspectRatio="xMaxYMid meet"
                          >
                            <path
                              d="M19.9253444,58.766315 C19.8876048,58.7384908 19.8458927,58.7037105 19.8021942,58.6654521 C19.094081,57.7879944 14.7152991,52.3026415 10.2535896,45.2670801 C8.91532497,43.0252402 8.046322,41.2767839 8.21317057,40.8246398 C8.64965835,39.6490651 16.4279798,39.0056292 18.8234486,40.0713975 C19.5519214,40.3948545 19.5335482,40.8231492 19.5335482,41.0725738 C19.5335482,42.1487762 19.4804148,45.0365363 19.4804148,45.0365363 C19.4809114,45.6332671 19.9660634,46.1172104 20.5634408,46.1162167 C21.1618115,46.1162167 21.6449771,45.630286 21.6429908,45.0320645 L21.6305765,37.8365137 L21.6285902,37.8365137 C21.6285902,37.2119586 20.9467953,37.055944 20.8186794,37.0315978 C19.5683083,37.0256354 17.0293299,37.0171888 14.3031434,37.0171888 C8.28765654,37.0171888 6.94343308,37.264129 5.92148558,36.5958501 C3.707266,35.1479951 0.0867513255,25.3896318 0.0023338937,19.8993102 C-0.117836803,12.1537335 4.47149205,5.44808831 10.9338947,2.12557426 C13.6337628,0.766160708 16.6832184,0 19.9039917,0 C30.132405,0 38.555775,7.72023676 39.6765405,17.6529986 C39.6775337,17.6614452 39.6775337,17.6708856 39.67952,17.6793322 C39.8851013,20.0806647 26.6504342,20.5909417 24.0325007,19.8923542 C23.6312696,19.785032 23.528479,19.3741274 23.528479,19.1972447 C23.5254995,17.371278 23.5130852,12.2327345 23.5130852,12.2327345 C23.5110989,11.6355068 23.025947,11.1510667 22.4285695,11.1525572 L22.4275764,11.1525572 C21.831192,11.153551 21.3470332,11.6389848 21.3470332,12.2372063 L21.3683859,21.7029181 C21.3867591,22.2991521 21.8873048,22.4601353 22.024359,22.4869659 C23.5130852,22.4874627 26.9945594,22.4839847 30.2371819,22.4839847 C34.6199364,22.4839847 36.460733,22.9917773 37.6857789,23.9243867 C38.5001588,24.5454638 38.8154827,25.7344538 38.5398847,27.2796936 C36.0823442,41.0258688 20.5103075,58.0562997 19.9253444,58.766315 Z M62.158293,26.6840558 C66.0871796,28.3679201 68.5213811,30.23612 68.5213811,34.3367194 C68.5213811,38.5257602 65.3482788,41.2316689 60.4386603,41.2316689 C56.4601164,41.2316689 53.2666546,39.4295516 51.6761309,36.2864046 L51.418906,35.7796057 L56.0966249,33.0692253 L56.4030105,33.5700618 C57.4562421,35.2916875 58.633617,36.0255522 60.3418285,36.0255522 C61.8141679,36.0255522 62.8033415,35.3731729 62.8033415,34.4013114 C62.8033415,33.3246122 62.0872831,32.9211605 59.8740566,31.9522802 L58.7493185,31.4698275 C55.7475339,30.1904087 52.9667244,28.4126376 52.9667244,24.1068343 C52.9667244,20.2372755 55.9327557,17.5348449 60.1799457,17.5348449 C63.3977396,17.5348449 65.6030208,18.7804771 67.1210449,21.4535929 L67.4026018,21.9499577 L62.8703789,24.8625609 L62.5580344,24.3035915 C61.8002638,22.9481529 61.0866882,22.6763695 60.1799457,22.6763695 C59.2319876,22.6763695 58.6212026,23.199068 58.6212026,24.0099463 C58.6212026,24.9415619 59.0710979,25.3504791 61.0320652,26.2001125 L62.158293,26.6840558 Z M95.2686968,27.476898 L98.5709081,18.2690574 L104.238794,18.2690574 L95.8387627,41.611619 L94.5799498,41.611619 L89.484613,30.6796684 C89.2477476,30.1788318 89.0034336,29.556761 88.7928866,28.9868606 C88.5773739,29.5577547 88.327101,30.1813161 88.089739,30.6821527 L82.7952763,41.611619 L81.5449052,41.611619 L73.0103029,18.2690574 L79.065019,18.2690574 L82.4034802,27.476898 C82.61651,28.0641885 82.8350022,28.7801662 83.0261829,29.4444702 C83.2531168,28.7588011 83.5257354,28.0184772 83.8107684,27.4217464 L88.1955091,18.0767719 L89.4086373,18.0767719 L93.8614085,27.4227401 C94.1454483,28.0189741 94.4190601,28.7597949 94.6450009,29.445464 C94.8371747,28.7801662 95.0571566,28.0641885 95.2686968,27.476898 Z M110.84853,40.9414023 L110.84853,17.7921198 L116.569052,17.7921198 L116.569052,40.9414023 L110.84853,40.9414023 Z M135.325265,33.163629 L135.325265,27.9903052 L145.94746,27.9903052 L145.94746,38.3652739 L145.727975,38.5461315 C144.512861,39.5438298 141.291094,41.2316689 136.926713,41.2316689 C129.564023,41.2316689 124.423995,36.3529841 124.423995,29.3676057 C124.423995,22.5114114 129.383767,17.5348449 136.217607,17.5348449 C139.975672,17.5348449 142.730163,18.594154 144.637004,20.7738862 L145.009434,21.1996966 L141.110342,25.059815 L140.686765,24.6235704 C139.59778,23.500663 138.469566,22.8050567 136.217607,22.8050567 C132.717263,22.8050567 130.272137,25.5035125 130.272137,29.3676057 C130.272137,33.3926822 132.883118,35.99425 136.926713,35.99425 C138.267957,35.99425 139.664321,35.7632093 140.614762,35.394041 L140.614762,33.163629 L135.325265,33.163629 Z M164.314658,33.163629 L164.314658,27.9903052 L174.936853,27.9903052 L174.936853,38.3652739 L174.717368,38.5461315 C173.501261,39.5438298 170.280487,41.2316689 165.917099,41.2316689 C158.554409,41.2316689 153.413388,36.3529841 153.413388,29.3676057 C153.413388,22.5114114 158.374153,17.5348449 165.206006,17.5348449 C168.966058,17.5348449 171.720549,18.594154 173.626397,20.7738862 L173.99982,21.1996966 L170.101721,25.059815 L169.677151,24.6235704 C168.587669,23.500663 167.458959,22.8050567 165.206006,22.8050567 C161.706656,22.8050567 159.26153,25.5035125 159.26153,29.3676057 C159.26153,33.3926822 161.873504,35.99425 165.917099,35.99425 C167.258343,35.99425 168.653714,35.7632093 169.604155,35.394041 L169.604155,33.163629 L164.314658,33.163629 Z M195.897503,17.7922192 L201.87674,17.7922192 L193.669876,33.1964218 L193.669876,40.9415017 L187.918566,40.9415017 L187.918566,33.5253443 L179.1759,17.7922192 L185.555871,17.7922192 L189.596487,25.1730995 C190.030988,25.9760279 190.484856,27.0373245 190.827988,27.8988826 C191.155726,27.0442805 191.589235,25.9924244 192.020757,25.1800555 L195.897503,17.7922192 Z"
                              fill="#FC8019"
                            ></path>
                          </svg>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
