import { useFilter } from '@/src/contexts/filter-context'
import { Accordion } from '@/src/components/accordion'
import { Checkbox } from '@/src/components/checkbox'
import { DialogMap } from '@/src/components/dialog-map'
import { RadioGroup } from '@/src/components/radio-group'
import { Slider } from '@/src/components/slider'
import { css } from '@/styled-system/css'

type SidebarProps = {
  tags: Array<{
    id: string
    name: string
    count: number
  }>
}

export function Sidebar({ tags }: SidebarProps) {
  const {
    handleTag,
    handlePrice,
    handleSort,
    handleDelivery,
    isCheckedTag,
    state
  } = useFilter()

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        bg: 'light.gray.100',
        w: 'full',
        h: 'full',
        maxHeight: 'calc(100vh - 4.5rem)',
        overflow: 'auto',
        mb: '8',
        scrollbarGutter: 'stable',
        boxShadow: 'lg',
        lg: { w: '80' },
        sm: {
          position: 'fixed',
          w: '60',
          boxShadow: 'none',
          mb: '0'
        }
      })}
    >
      <div>
        <DialogMap />

        <RadioGroup.Root
          defaultValue="delivery"
          value={state.delivery}
          onValueChange={handleDelivery}
        >
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column'
            })}
          >
            <RadioGroup.Item value="delivery">Entrega</RadioGroup.Item>
            <RadioGroup.Item value="pickup">Retirada</RadioGroup.Item>
          </div>
        </RadioGroup.Root>
      </div>

      <Accordion.Root>
        <div
          className={css({
            h: '0.5',
            w: 'full',
            bg: 'light.gray.200'
          })}
        />
        <Accordion.Item value="order">
          <Accordion.Trigger>Ordenar</Accordion.Trigger>
          <Accordion.Content>
            <RadioGroup.Root value={state.sort} onValueChange={handleSort}>
              <div
                className={css({
                  display: 'flex',
                  flexDirection: 'column'
                })}
              >
                <RadioGroup.Item value="rating">Avaliação</RadioGroup.Item>
                <RadioGroup.Item value="delivery time">
                  Tempo de entrega
                </RadioGroup.Item>
              </div>
            </RadioGroup.Root>
          </Accordion.Content>
        </Accordion.Item>
        {state.delivery === 'delivery' && (
          <>
            <div
              className={css({
                h: '0.5',
                w: 'full',
                bg: 'light.gray.200'
              })}
            />
            <Accordion.Item value="price">
              <Accordion.Trigger>Preço para entrega</Accordion.Trigger>
              <Accordion.Content>
                <div
                  className={css({
                    display: 'flex'
                  })}
                >
                  <Slider value={state.price} onValueChange={handlePrice} />
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </>
        )}
        <div
          className={css({
            h: '0.5',
            w: 'full',
            bg: 'light.gray.200'
          })}
        />
        <Accordion.Item value="category">
          <Accordion.Trigger>Categorias</Accordion.Trigger>
          <Accordion.Content>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column'
              })}
            >
              {tags &&
                tags.map(t => (
                  <Checkbox
                    checked={isCheckedTag(t.name)}
                    onChangeChecked={() => handleTag(t.name)}
                    key={`sidebar-checkbox-key-${t.id}`}
                    value={t.name.toLowerCase()}
                    qty={t.count}
                  >
                    {t.name}
                  </Checkbox>
                ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}
