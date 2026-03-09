import * as SliderPrimitive from '@radix-ui/react-slider'
import { X } from 'phosphor-react'
import { css } from '@/styled-system/css'

type SliderProps = {
  onValueChange: (value: number[] | undefined) => void
  value: number[] | undefined
}
export function Slider({ value, onValueChange }: SliderProps) {
  return (
    <div
      className={css({
        display: 'flex',
        flex: 1,
        h: '10',
        px: '4',
        alignItems: 'center',
        justifyContent: 'space-between'
      })}
    >
      <SliderPrimitive.Root
        defaultValue={undefined}
        max={7.5}
        step={3.75}
        aria-label="Preços para entrega"
        className={css({
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          w: '3/6',
          h: '4'
        })}
        value={value}
        onValueChange={onValueChange}
      >
        <SliderPrimitive.Track
          className={css({
            bg: 'light.gray.200',
            position: 'relative',
            flexGrow: 1,
            borderRadius: 'full',
            h: '1'
          })}
        >
          <SliderPrimitive.Range
            className={css({
              position: 'absolute',
              borderRadius: 'full',
              h: 'full',
              bg: value?.length ? 'light.gray.800' : 'transparent'
            })}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={css({
            display: 'flex',
            w: '4',
            h: '4',
            borderRadius: 'full',
            boxShadow: 'xs',
            bg: value?.length ? 'light.gray.800' : 'light.gray.200',
            _focus: {
              outlineStyle: 'solid',
              outlineWidth: '2px',
              outlineOffset: '2px',
              outlineColor: 'light.indigo.300'
            }
          })}
        />
      </SliderPrimitive.Root>
      {!!value?.length && (
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '2',
            bg: 'light.gray.200',
            pl: '1'
          })}
        >
          <span
            className={css({
              fontSize: 'sm',
              fontWeight: 'medium'
            })}
          >
            R${value}
          </span>
          <button
            onClick={() => onValueChange(undefined)}
            className={css({
              p: '1'
            })}
          >
            <X
              className={css({
                w: '4',
                h: '4',
                color: 'light.gray.800'
              })}
              weight="bold"
            />
          </button>
        </div>
      )}
    </div>
  )
}
