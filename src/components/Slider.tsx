import clsx from 'clsx'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { X } from 'phosphor-react'

type SliderProps = {
  onValueChange: (value: number[] | undefined) => void
  value: number[] | undefined
}
export function Slider({ value, onValueChange }: SliderProps) {
  return (
    <div className="flex flex-1 h-10 px-4 items-center justify-between">
      <SliderPrimitive.Root
        defaultValue={undefined}
        max={7.5}
        step={3.75}
        aria-label="Preços para entrega"
        className="relative flex items-center w-3/6 h-4"
        value={value}
        onValueChange={onValueChange}
      >
        <SliderPrimitive.Track className="bg-light-gray-200 relative flex-grow rounded-full h-1">
          <SliderPrimitive.Range
            className={clsx(
              'absolute rounded-full h-full',
              value?.length ? 'bg-light-gray-800' : 'bg-transparent'
            )}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={clsx(
            'flex w-4 h-4 rounded-full shadow-sm shadow-light-gray-800',
            'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
            value?.length ? 'bg-light-gray-800' : 'bg-light-gray-200'
          )}
        />
      </SliderPrimitive.Root>
      {!!value?.length && (
        <div className="flex items-center gap-2 bg-light-gray-200 pl-1">
          <span className="text-sm font-medium">R${value}</span>
          <button onClick={() => onValueChange(undefined)} className="p-1">
            <X className="w-4 h-4 text-light-gray-800" weight="bold" />
          </button>
        </div>
      )}
    </div>
  )
}
