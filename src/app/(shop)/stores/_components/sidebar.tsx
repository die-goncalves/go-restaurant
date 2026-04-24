'use client'

import { Accordion } from '@/src/components/ui/accordion'
import { Checkbox } from '@/src/components/ui/checkbox'
import { RadioGroup } from '@/src/components/ui/radio-group'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { Slider } from '@/src/components/ui/slider'
import {
  DeliveryMode,
  SortOption,
  useFilter
} from '@/src/contexts/filter-context'
import { formatNumber } from '@/src/utils/format-number'
import { css } from '@/styled-system/css'
import { Data } from '../page'
import { ChangeAddress } from './change-address'

const DELIVERY_OPTIONS: {
  label: string
  description: string
  value: DeliveryMode
}[] = [
  { label: 'Entrega', description: 'Receba no endereço', value: 'delivery' },
  {
    label: 'Retirada',
    description: 'Busque no estabelecimento',
    value: 'pickup'
  }
]
function DeliveryModeSection({
  value,
  onChange
}: {
  value: DeliveryMode
  onChange: (mode: DeliveryMode) => void
}) {
  return (
    <div className={css({ padding: '4' })}>
      <RadioGroup.Root
        name="fulfillmentType"
        defaultValue="delivery"
        value={value}
        onValueChange={({ value }) => {
          if (value) onChange(value as DeliveryMode)
        }}
      >
        <RadioGroup.Legend className={css({ marginBlockEnd: '2' })}>
          Como você quer receber seu pedido?
        </RadioGroup.Legend>

        {DELIVERY_OPTIONS.map(option => (
          <RadioGroup.Item
            key={option.value}
            value={option.value}
            className={css({ alignItems: 'start' })}
          >
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemText>
              <div
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  paddingBlockStart: 'calc((40px - 1.5em) / 2)'
                })}
              >
                <span>{option.label}</span>
                <span className={css({ textStyle: 'sm' })}>
                  {option.description}
                </span>
              </div>
            </RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  )
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Avaliação', value: 'rating' },
  { label: 'Tempo de entrega', value: 'delivery_time' }
]
function SortSection({
  value,
  onChange
}: {
  value: SortOption | null
  onChange: (sort: SortOption | null) => void
}) {
  return (
    <div className={css({ padding: '4' })}>
      <RadioGroup.Root
        value={value}
        onValueChange={({ value }) => {
          if (value) onChange(value as SortOption)
        }}
      >
        <RadioGroup.Legend className={css({ marginBlockEnd: '2' })}>
          Ordenar por?
        </RadioGroup.Legend>

        {SORT_OPTIONS.map(option => (
          <RadioGroup.Item key={option.value} value={option.value}>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemText>{option.label}</RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  )
}

const PRICE_RANGE_MAX = 10
const PRICE_RANGE_STEP = 2.5
const PRICE_MARKERS = [0, 2.5, 5, 7.5, 10]
function PriceRangeSection({
  value,
  onChange
}: {
  value: number[] | undefined
  onChange: (range: number[]) => void
}) {
  return (
    <div className={css({ padding: '4' })}>
      <Slider.Root
        max={PRICE_RANGE_MAX}
        step={PRICE_RANGE_STEP}
        thumbAlignment="contain"
        orientation="horizontal"
        value={value}
        onValueChange={({ value }) => onChange(value)}
      >
        {({ value }) => (
          <>
            <div
              className={css({
                display: 'flex',
                justifyContent: 'space-between'
              })}
            >
              <Slider.Label className={css({ textStyle: 'md' })}>
                Preço para entrega até
              </Slider.Label>
              <Slider.ValueText>
                {formatNumber({
                  options: { currency: 'BRL' },
                  numberToBeFormatted: Number(value.at(0))
                })}
              </Slider.ValueText>
            </div>

            <Slider.MarkerGroup>
              {PRICE_MARKERS.map(marker => (
                <Slider.Marker key={marker} value={marker} />
              ))}
            </Slider.MarkerGroup>

            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
                <Slider.InactiveRange />
              </Slider.Track>
              {value.map((_, index) => (
                <Slider.Thumb key={index} index={index}>
                  <Slider.HiddenInput index={index} />
                </Slider.Thumb>
              ))}
            </Slider.Control>
          </>
        )}
      </Slider.Root>
    </div>
  )
}

function CategorySection({
  categories,
  isCategoryActive,
  toggleCategory
}: {
  categories: Data['categories']
  isCategoryActive: (category: string) => boolean
  toggleCategory: (category: string) => void
}) {
  return (
    <Accordion.Root collapsible>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(1, min-content)',
          gridRowGap: '4'
        })}
      >
        <Accordion.Item value="category">
          <Accordion.ItemTrigger heading="h3">
            Categorias
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemContentInner
              className={css({
                display: 'grid',
                gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                gridAutoRows: 'minmax(0, 1fr)',
                gridRowGap: '2',
                paddingBlock: '2'
              })}
            >
              {categories.map(category => (
                <Checkbox.Root
                  key={category.id}
                  value={category.name.toLowerCase()}
                  checked={isCategoryActive(category.name)}
                  onCheckedChange={() => toggleCategory(category.name)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>{category.name}</Checkbox.Label>
                </Checkbox.Root>
              ))}
            </Accordion.ItemContentInner>
          </Accordion.ItemContent>
        </Accordion.Item>
      </div>
    </Accordion.Root>
  )
}

export function Sidebar({ categories }: Pick<Data, 'categories'>) {
  const {
    state,
    toggleCategory,
    setPriceRange,
    setSort,
    setDeliveryMode,
    isCategoryActive
  } = useFilter()

  return (
    <aside
      className={css({
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        background: 'surface.container',
        width: {
          base: 'clamp(var(--sizes-60), 30dvw, var(--sizes-80))',
          large: '80'
        },
        height: '100dvh',
        maxHeight: '100dvh'
      })}
    >
      <ChangeAddress />

      <ScrollArea.Root size="sm" variant="always">
        <ScrollArea.Viewport>
          <ScrollArea.Content
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4'
            })}
          >
            <DeliveryModeSection
              value={state.deliveryMode}
              onChange={setDeliveryMode}
            />

            <SortSection value={state.sort} onChange={setSort} />

            {state.deliveryMode === 'delivery' && (
              <PriceRangeSection
                value={state.priceRange}
                onChange={setPriceRange}
              />
            )}

            <CategorySection
              categories={categories}
              isCategoryActive={isCategoryActive}
              toggleCategory={toggleCategory}
            />
          </ScrollArea.Content>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb orientation="vertical" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb orientation="horizontal" />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner />
      </ScrollArea.Root>
    </aside>
  )
}
