'use client'

import { Portal } from '@zag-js/react'
import { useCallback, useEffect, useState } from 'react'
import { CloseIcon } from '@/src/components/icons/close'
import { GlobeLocationPinIcon } from '@/src/components/icons/globe-location-pin'
import { Button } from '@/src/components/ui/button'
import { Dialog } from '@/src/components/ui/dialog'
import { css } from '@/styled-system/css'
import { Map } from './map'

type LocationProps = {
  coord: {
    lat: number
    lng: number
  } | null
  address: string | null
}
export function Location({ address, coord }: LocationProps) {
  const [mapReady, setMapReady] = useState(false)
  const [node, setNode] = useState<HTMLDivElement | null>(null)

  const handleContentRef = useCallback((n: HTMLDivElement | null) => {
    setNode(n)
  }, [])

  useEffect(() => {
    if (!node) return

    const handler = () => setMapReady(true)
    node.addEventListener('animationend', handler, { once: true })

    return () => node.removeEventListener('animationend', handler)
  }, [node])

  return (
    <div>
      <Dialog.Root
        size="md"
        onOpenChange={({ open }) => {
          if (!open) setMapReady(false)
        }}
      >
        <Dialog.Trigger asChild>
          <Button
            variant="solid"
            className={css({ padding: 0 })}
            aria-label="Ver localização da loja"
          >
            <GlobeLocationPinIcon />
          </Button>
        </Dialog.Trigger>

        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content ref={handleContentRef}>
              {({ setOpen }) => (
                <>
                  <header
                    className={css({
                      display: 'flex',
                      paddingBlockStart: { base: '4', medium: '6' },
                      paddingBlockEnd: '4',
                      paddingInline: { base: '4', medium: '6' },
                      alignItems: 'start',
                      justifyContent: 'space-between'
                    })}
                  >
                    <Dialog.Title
                      as="h2"
                      className={css({
                        minHeight: '10',
                        justifySelf: 'center',
                        textStyle: 'xl',
                        paddingTop: 'calc((40px - 1.4em) / 2)'
                      })}
                    >
                      Localização
                    </Dialog.Title>

                    <Dialog.CloseTrigger asChild>
                      <Button className={css({ padding: 0 })}>
                        <CloseIcon />
                      </Button>
                    </Dialog.CloseTrigger>
                  </header>

                  <main
                    className={css({
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'auto'
                    })}
                  >
                    <Dialog.Description
                      className={css({
                        paddingInline: { base: '4', medium: '6' }
                      })}
                    >
                      <p>{address}</p>
                    </Dialog.Description>

                    <div
                      className={css({
                        position: 'relative',
                        width: '100%',
                        height: '50dvh'
                      })}
                    >
                      {mapReady && <Map point={coord} />}
                    </div>
                  </main>

                  <footer
                    className={css({
                      display: 'flex',
                      paddingBlockStart: '4',
                      paddingBlockEnd: { base: '4', medium: '6' },
                      paddingInline: { base: '4', medium: '6' },
                      flexDirection: 'column',
                      gap: '4'
                    })}
                  >
                    <Button
                      variant="solid"
                      className={css({
                        marginLeft: 'auto',
                        width: { base: '100%', medium: 'fit-content' }
                      })}
                      onClick={() => setOpen(false)}
                    >
                      Fechar
                    </Button>
                  </footer>
                </>
              )}
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </div>
  )
}
