import { Portal } from '@zag-js/react'
import NextImage from 'next/image'
import { useMemo, useState } from 'react'
import { CloseIcon } from '@/src/components/icons/close'
import { StarIcon } from '@/src/components/icons/star'
import { Button } from '@/src/components/ui/button'
import { Dialog } from '@/src/components/ui/dialog'
import { RatingGroup } from '@/src/components/ui/rating-group'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { logger } from '@/src/lib/logger'
import { createClient } from '@/src/lib/supabase/client'
import { formatNumber } from '@/src/utils/format-number'
import { getStarColor } from '@/src/utils/get-star-color'
import { css } from '@/styled-system/css'
import { OrderProductItem } from '../../page'

const log = logger.child({ module: 'client', component: 'RatingCard' })

type RatingCardProps = {
  product: OrderProductItem
  profileId: string
  onRatingSaved?: (
    productId: string,
    rating: {
      id: string
      stars?: number
      comment?: string | null
    }
  ) => void
}
export function RatingCard({
  product,
  profileId,
  onRatingSaved
}: RatingCardProps) {
  const supabase = useMemo(() => createClient(), [])

  const existingRating = product.product_ratings[0]

  const [stars, setStars] = useState<number | undefined>(
    existingRating?.stars ?? undefined
  )
  const [comment, setComment] = useState<string>(existingRating?.comment ?? '')
  const [saveStatus, setSaveStatus] = useState<{
    saved: boolean
    loading: boolean
  }>({ saved: false, loading: false })

  const [currentRatingId, setCurrentRatingId] = useState<string | undefined>(
    product.product_ratings[0]?.id
  )

  const handleSubmit = async (onSuccess?: () => void) => {
    if (stars === undefined && !comment.trim()) return

    setSaveStatus({ saved: false, loading: false })

    const submitLog = log.child({
      handler: 'handleSubmit',
      productId: product.product.id,
      storeId: product.store.id,
      stars,
      comment
    })

    const { data, error } = await supabase
      .from('product_ratings')
      .upsert({
        id: currentRatingId,
        order_product_id: product.id,
        product_id: product.product.id,
        store_id: product.store.id,
        profile_id: profileId,
        stars: stars!,
        comment,
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (error) {
      submitLog.error({ error }, 'Error saving rating')
      setSaveStatus({ saved: false, loading: false })
      return
    }

    if (data) {
      setCurrentRatingId(data.id)

      onRatingSaved?.(product.id, {
        id: data.id,
        ...(stars !== undefined && { stars }),
        ...(comment.trim() && { comment: comment.trim() })
      })
    }

    setSaveStatus({ saved: true, loading: false })

    onSuccess?.()
  }

  const date = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'long'
  }).format(new Date(product.order.created_at ?? ''))

  const price = formatNumber({
    options: { currency: 'BRL' },
    numberToBeFormatted: product.price_cents / 100
  })
  return (
    <Dialog.Root
      onOpenChange={({ open }) => {
        if (open) {
          setStars(existingRating?.stars ?? undefined)
          setComment(existingRating?.comment ?? '')
        }
      }}
    >
      <Dialog.Trigger asChild>
        <button
          className={css({
            position: 'relative',
            isolation: 'isolate',
            appearance: 'none',
            userSelect: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'start',
            width: '100%',
            height: 'min-content',
            overflow: 'hidden',
            background: 'surface.container',
            padding: '4',
            outlineStyle: 'none',
            outlineWidth: '2px',
            outlineOffset: '2px',
            outlineColor: 'transparent',
            _focusVisible: {
              outlineStyle: 'solid',
              outlineColor: 'outline',
              _after: {
                transitionProperty: 'background',
                transitionDuration: '200ms',
                transitionTimingFunction:
                  'token(easings.expressive-default-effects)'
              }
            },
            _hover: {
              _after: {
                transitionProperty: 'background',
                transitionDuration: '200ms',
                transitionTimingFunction:
                  'token(easings.expressive-default-effects)'
              }
            },
            _after: {
              content: '""',
              position: 'absolute',
              inset: 0,
              zIndex: -1,
              background: 'transparent',
              borderRadius: 'inherit',
              pointerEvents: 'none',
              transitionProperty: 'background',
              transitionDuration: '150ms',
              transitionTimingFunction: 'token(easings.expressive-fast-effects)'
            },
            _notDisabled: {
              _hover: {
                _after: {
                  background: 'surface.on/8'
                }
              },
              _focusVisible: {
                _after: {
                  background: 'surface.on/10'
                }
              }
            }
          })}
        >
          <div
            className={css({
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) min-content',
              marginBlockEnd: '4',
              paddingBlockEnd: '3',
              borderBlockEndWidth: '2px',
              borderBlockEndStyle: 'dotted',
              borderBlockEndColor: 'outline.variant'
            })}
          >
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25em'
              })}
            >
              <p
                className={css({
                  maxWidth: '50%',
                  textWrap: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textStyle: 'sm',
                  background: 'surface.on/8',
                  color: 'surface.on'
                })}
                title={product.order.id}
              >
                {product.order.id}
              </p>
              <p className={css({ textStyle: 'sm' })}>{date}</p>
            </div>

            <div
              className={css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25em'
              })}
            >
              <span
                className={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  flexShrink: 0
                })}
              >
                <StarIcon
                  style={{
                    fill: getStarColor(
                      product.product_ratings[0]?.stars ?? null
                    )
                  }}
                  className={css({ width: '5', height: '5' })}
                />
              </span>

              {product.product_ratings[0]?.stars && (
                <span>{product.product_ratings[0].stars}</span>
              )}
            </div>
          </div>

          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: '3',
              marginBlockEnd: '3',
              paddingBlockEnd: '3',
              borderBlockEndWidth: '2px',
              borderBlockEndStyle: 'solid',
              borderBlockEndColor: 'outline.variant'
            })}
          >
            <div
              className={css({
                position: 'relative',
                width: '12',
                height: '12',
                alignSelf: 'start'
              })}
            >
              <NextImage
                src={product.product.image_url ?? ''}
                alt={product.product.name}
                fill
                className={css({ objectFit: 'cover' })}
              />
            </div>
            <div className={css({ flex: 1 })}>
              <h3 className={css({ marginBlockEnd: '1' })}>
                {product.product.name}
              </h3>
              <p className={css({ textStyle: 'sm' })}>
                <span>Qtde: {product.quantity}</span>
                <span
                  className={css({
                    display: 'inline',
                    _before: {
                      display: 'inline-block',
                      content: '""',
                      width: '1',
                      height: '1',
                      marginInline: '0.25em',
                      verticalAlign: 'middle',
                      background: 'surface.on'
                    }
                  })}
                />
                <span>{price}</span>
              </p>
            </div>
          </div>

          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: '3',
              marginBlockEnd: product.product_ratings[0]?.comment
                ? '3'
                : 'unset',
              paddingBlockEnd: product.product_ratings[0]?.comment
                ? '3'
                : 'unset',
              borderBlockEndWidth: '2px',
              borderBlockEndStyle: product.product_ratings[0]?.comment
                ? 'solid'
                : 'none',
              borderBlockEndColor: 'outline.variant'
            })}
          >
            <div
              className={css({
                position: 'relative',
                width: '12',
                height: '12',
                alignSelf: 'start'
              })}
            >
              <NextImage
                src={product.store.image_url ?? ''}
                alt={product.store.name}
                fill
                className={css({ objectFit: 'cover' })}
              />
            </div>
            <p className={css({})}>{product.store.name}</p>
          </div>

          {product.product_ratings[0]?.comment && (
            <p className={css({ fontStyle: 'italic' })}>
              {product.product_ratings[0].comment}
            </p>
          )}
        </button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
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
                    Detalhes da avaliação
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
                    overflow: 'auto',
                    minWidth: '0',
                    width: '100%'
                  })}
                >
                  <ScrollArea.Root size="sm" variant="always">
                    <ScrollArea.Viewport>
                      <ScrollArea.Content
                        className={css({
                          display: 'flex',
                          flexDirection: 'column'
                        })}
                      >
                        <div
                          className={css({
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4',
                            paddingInline: { base: '4', medium: '6' }
                          })}
                        >
                          <RatingGroup.Root
                            value={stars}
                            onValueChange={({ value }) => setStars(value)}
                          >
                            <RatingGroup.Label>
                              Sua nota para o produto
                            </RatingGroup.Label>
                            <RatingGroup.Control>
                              {({ items }) => {
                                return items.map(index => (
                                  <RatingGroup.Item key={index} index={index}>
                                    <StarIcon />
                                  </RatingGroup.Item>
                                ))
                              }}
                            </RatingGroup.Control>
                            <RatingGroup.HiddenInput />
                          </RatingGroup.Root>

                          <label
                            className={css({
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2',
                              contain: 'inline-size'
                            })}
                          >
                            O que você achou do produto?
                            <textarea
                              value={comment}
                              onChange={e => setComment(e.target.value)}
                              className={css({
                                display: 'block',
                                alignItems: 'center',
                                width: '100%',
                                minWidth: '0',
                                fieldSizing: 'content',
                                boxSizing: 'border-box',
                                resize: 'none',
                                minHeight: '10',
                                paddingInline: '3',
                                paddingBlock: 'calc((40px - 1.5em - 4px) / 2)',
                                color: 'surface.on',
                                textAlign: 'start',
                                borderWidth: '2px',
                                borderColor: 'surface.on',
                                outlineStyle: 'none',
                                outlineWidth: '2px',
                                outlineOffset: '2px',
                                outlineColor: 'transparent',
                                _placeholder: { color: 'surface.on/56' },
                                _focus: {
                                  outlineStyle: 'solid',
                                  outlineColor: 'outline'
                                }
                              })}
                            />
                          </label>
                        </div>
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
                  <div
                    className={css({
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '2'
                    })}
                  >
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                      Fechar
                    </Button>

                    <Button
                      variant="solid"
                      disabled={
                        saveStatus.loading ||
                        (stars === undefined && !comment.trim())
                      }
                      onClick={() => handleSubmit(() => setOpen(false))}
                    >
                      {saveStatus.loading ? 'Salvando...' : 'Enviar avaliação'}
                    </Button>
                  </div>
                </footer>
              </>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
