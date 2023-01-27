import clsx from 'clsx'
import { useState } from 'react'
import { GlobeHemisphereWest, X } from 'phosphor-react'
import { Dialog } from '../Dialog'
import { TextInput } from '../TextInput'
import NonInteractiveMap from './NonInteractiveMap'

type NonInteractiveDialogMapProps = {
  coordinates: { lat: number; lng: number }
  address: string
}
export function NonInteractiveDialogMap({
  coordinates,
  address
}: NonInteractiveDialogMapProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button
          className={clsx(
            'rounded p-2 bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
            'transition-[background-color, outline] ease-in duration-150',
            'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
          )}
        >
          <GlobeHemisphereWest className="w-6 h-6 text-light-gray-800" />
        </button>
      </Dialog.Trigger>

      <Dialog.Content
        onCloseInteractOverlay={() => setOpen(false)}
        className={clsx(
          'xl:w-2/5',
          'lg:w-1/2',
          'sm:w-2/3',
          'flex flex-col h-3/4 w-[calc(100vw-2rem)]'
        )}
      >
        <header
          className={clsx(
            'flex gap-4 p-4 justify-between',
            '2xs:items-center',
            'items-start'
          )}
        >
          <p className="text-xl font-medium">Localização do restaurante</p>
          <Dialog.Close>
            <button
              className={clsx(
                'p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                'transition-[background-color] ease-in duration-150',
                'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
            >
              <X className="w-6 h-6" />
            </button>
          </Dialog.Close>
        </header>

        <NonInteractiveMap coordinates={coordinates} />

        <footer className="flex justify-center p-4 gap-4">
          <TextInput
            placeholder="Clique no mapa e verá o endereço aqui"
            readOnly
            value={address}
          />
        </footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
