'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { Portal } from '@zag-js/react'
import {
  Fragment,
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react'
import { KeyboardArrowRightIcon } from '@/src/components/icons/keyboard-arrow-right'
import { KeyboardDoubleArrowRightIcon } from '@/src/components/icons/keyboard-double-arrow-right'
import { Button } from '@/src/components/ui/button'
import { Select } from '@/src/components/ui/select'
import * as TextInput from '@/src/components/ui/text-input'
import { ToggleGroup } from '@/src/components/ui/toggle-group'
import { css } from '@/styled-system/css'
import { OrderProductItem } from '../../page'
import { RatingCard } from './rating-card'

const COMMENT_FILTERS = [
  { value: 'with-comment', label: 'Com comentários' },
  { value: 'without-comment', label: 'Sem comentários' }
] as const

const STAR_FILTERS = [
  { value: 'rated', label: 'Com avaliação' },
  { value: 'unrated', label: 'Sem avaliação' },
  { value: '5', label: '★ 5' },
  { value: '4', label: '★ 4' },
  { value: '3', label: '★ 3' },
  { value: '2', label: '★ 2' },
  { value: '1', label: '★ 1' }
] as const

const SORT_OPTIONS = [
  { value: 'created_at-desc', label: 'Data (mais recente)' },
  { value: 'created_at-asc', label: 'Data (mais antiga)' },
  { value: 'price_cents-desc', label: 'Preço (maior)' },
  { value: 'price_cents-asc', label: 'Preço (menor)' },
  { value: 'stars-desc', label: 'Nota (maior)' },
  { value: 'stars-asc', label: 'Nota (menor)' }
] as const

type RatingClientProps = {
  products: OrderProductItem[] | null
  profileId: string
}
export function RatingsAndComments({ products, profileId }: RatingClientProps) {
  'use no memo'

  const gridRef = useRef<HTMLDivElement | null>(null)
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: true }
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [localProducts, setLocalProducts] = useState<OrderProductItem[]>(
    products ?? []
  )
  const skipPageResetRef = useRef(false)

  const focusGrid = useCallback(
    (func: () => void): MouseEventHandler<HTMLButtonElement> =>
      () => {
        if (!gridRef.current) return

        const prefersReducedMotion = true
        // const prefersReducedMotion = window.matchMedia(
        //   '(prefers-reduced-motion: reduce)'
        // ).matches

        requestAnimationFrame(() => {
          gridRef.current?.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start'
          })
          gridRef.current?.focus({ preventScroll: true })
        })

        func()
      },
    []
  )

  const data = useMemo(() => localProducts, [localProducts])
  const handleRatingSaved = useCallback(
    (
      productId: string,
      rating: {
        id: string
        stars?: number
        comment?: string | null
      }
    ) => {
      skipPageResetRef.current = true

      setLocalProducts(prev =>
        prev.map(p => {
          if (p.id !== productId) return p

          const existingRating = p.product_ratings[0]

          return {
            ...p,
            product_ratings: [
              {
                ...existingRating,
                id: rating.id,
                ...(rating.stars !== undefined && { stars: rating.stars }),
                ...(rating.comment !== undefined && { comment: rating.comment })
              }
            ]
          } satisfies OrderProductItem
        })
      )
    },
    []
  )

  const columns = useMemo<ColumnDef<OrderProductItem, unknown>[]>(
    () => [
      {
        id: 'product_name',
        accessorFn: row => row.product.name,
        filterFn: 'includesString' as const
      },
      {
        id: 'store_name',
        accessorFn: row => row.store.name,
        filterFn: 'includesString' as const
      },
      {
        id: 'payment_status',
        accessorFn: row => row.order.payment_status,
        filterFn: 'equals' as const
      },
      {
        id: 'stars',
        accessorFn: row => row.product_ratings[0]?.stars ?? null,
        filterFn: (row, columnId, filterValue) => {
          if (filterValue === 'rated')
            return row.original.product_ratings.length > 0
          if (filterValue === 'unrated')
            return row.original.product_ratings.length === 0
          if (filterValue)
            return (
              row.original.product_ratings[0]?.stars === Number(filterValue)
            )
          return true
        },
        sortingFn: (a, b) => {
          const sa = a.original.product_ratings[0]?.stars ?? -1
          const sb = b.original.product_ratings[0]?.stars ?? -1
          return sa - sb
        }
      },
      {
        id: 'price_cents',
        accessorKey: 'price_cents',
        sortingFn: 'basic' as const
      },
      {
        id: 'created_at',
        accessorFn: row => row.order.created_at,
        sortingFn: (a, b) =>
          new Date(a.original.order.created_at ?? '').getTime() -
          new Date(b.original.order.created_at ?? '').getTime()
      },
      {
        id: 'comment',
        accessorFn: row => row.product_ratings[0]?.comment ?? null,
        filterFn: (row, columnId, filterValue) => {
          const comment = row.original.product_ratings[0]?.comment
          if (filterValue === 'with-comment') {
            console.log({ row, columnId, filterValue })
            console.log({ comment })
            return !!comment && comment.trim().length > 0
          }
          if (filterValue === 'without-comment') {
            return !comment || comment.trim().length === 0
          }
          return true
        }
      }
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    autoResetPageIndex: !skipPageResetRef.current,
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = filterValue.toLowerCase()
      return (
        row.original.product.name.toLowerCase().includes(q) ||
        row.original.store.name.toLowerCase().includes(q)
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  skipPageResetRef.current = false

  const rows = table.getRowModel().rows

  return (
    <Fragment>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={css({ srOnly: true })}
      >
        {`Mostrando página ${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}
      </div>

      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4'
        })}
      >
        <TextInput.Root
          className={css({ width: '100%', minWidth: '60', maxWidth: '80' })}
        >
          <TextInput.Label htmlFor="rating-filter">
            Busque por produto ou loja
          </TextInput.Label>
          <TextInput.Input
            id="rating-filter"
            type="search"
            value={globalFilter}
            onChange={e => {
              setGlobalFilter(e.target.value)
              table.setPageIndex(0)
            }}
          />
        </TextInput.Root>

        <fieldset
          className={css({
            borderStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column'
          })}
        >
          <legend className={css({ float: 'left', marginBlockEnd: '2' })}>
            Comentários
          </legend>

          <ToggleGroup.Root
            onValueChange={({ value }) => {
              table.getColumn('comment')?.setFilterValue(value[0] || undefined)
            }}
          >
            {COMMENT_FILTERS.map(item => (
              <ToggleGroup.Item key={item.value} value={item.value}>
                {item.label}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </fieldset>

        <fieldset
          className={css({
            borderStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column'
          })}
        >
          <legend className={css({ float: 'left', marginBlockEnd: '2' })}>
            Avaliações
          </legend>

          <ToggleGroup.Root
            onValueChange={({ value }) => {
              table.getColumn('stars')?.setFilterValue(value[0] || undefined)
            }}
            className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}
          >
            {STAR_FILTERS.map(item => (
              <ToggleGroup.Item
                key={item.value}
                value={item.value}
                className={css({
                  isolation: 'isolate',
                  position: 'relative',
                  display: 'inline-flex',
                  height: '8',
                  minWidth: '8',
                  textStyle: 'sm',
                  paddingInline: '3',
                  gap: '1',
                  _icon: {
                    fill: 'currentColor',
                    width: '4',
                    height: '4'
                  },
                  alignItems: 'center',
                  justifyContent: 'center',
                  appearance: 'none',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  verticalAlign: 'middle',
                  cursor: 'pointer',
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
                    transitionTimingFunction:
                      'token(easings.expressive-fast-effects)'
                  },
                  background: 'transparent',
                  color: 'primary.surface.on.variant',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'secondary.container',
                  _notDisabled: {
                    _hover: {
                      _after: { background: 'primary.surface.on.variant/8' }
                    },
                    _focusVisible: {
                      _after: { background: 'primary.surface.on.variant/10' }
                    }
                  },
                  _checked: {
                    background: 'secondary.container',
                    color: 'secondary.container.on',
                    _notDisabled: {
                      _hover: {
                        _after: { background: 'secondary.container.on/8' }
                      },
                      _focusVisible: {
                        _after: { background: 'secondary.container.on/10' }
                      }
                    }
                  }
                })}
              >
                {item.label}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </fieldset>

        <div className={css({ width: '100%', minWidth: '60', maxWidth: '80' })}>
          <Select.Root
            items={SORT_OPTIONS}
            itemToValue={item => item.value}
            itemToString={item => item.label}
            closeOnSelect={true}
            defaultValue={['created_at-desc']}
            onValueChange={({ value }) => {
              const [id, desc] = value[0].split('-')
              setSorting([{ id, desc: desc === 'desc' }])
            }}
          >
            <Select.Label>Ordenações</Select.Label>

            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.Indicator />
              </Select.Trigger>
            </Select.Control>

            <Portal>
              <Select.Positioner>
                <Select.Content
                  className={css({
                    mediumDown: {
                      maxHeight:
                        'calc(var(--available-height) + 8px - 16px - 72px)'
                    }
                  })}
                >
                  {SORT_OPTIONS.map(item => {
                    return (
                      <Select.Item key={item.value} item={item}>
                        <Select.ItemText item={item}>
                          {item.label}
                        </Select.ItemText>
                        <Select.ItemIndicator item={item} />
                      </Select.Item>
                    )
                  })}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </div>

        <p
          aria-live="polite"
          aria-atomic="true"
          className={css({ textStyle: 'sm', color: 'surface.on.variant' })}
        >
          {table.getFilteredRowModel().rows.length} resultado(s)
        </p>
      </div>

      <div
        ref={gridRef}
        tabIndex={-1}
        aria-label="Lista de produtos para avaliar"
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          gap: '4',
          paddingBlock: '4',
          outlineStyle: 'none',
          medium: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
          large: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
          xlarge: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
          '@supports (display: grid-lanes)': {
            display: 'grid-lanes'
          }
        })}
      >
        {rows.length === 0 ? (
          <p
            className={css({
              gridColumn: '1 / -1',
              textAlign: 'center',
              color: 'surface.on.variant',
              py: '8'
            })}
          >
            Nenhum resultado encontrado.
          </p>
        ) : (
          rows.map(row => (
            <RatingCard
              key={row.id}
              product={row.original}
              profileId={profileId}
              onRatingSaved={handleRatingSaved}
            />
          ))
        )}
      </div>

      <nav
        aria-label="Paginação de avaliações"
        className={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBlockStart: '2',
          flexWrap: 'wrap',
          gap: '2'
        })}
      >
        <p className={css({ flexWrap: 'wrap' })}>
          {`Página ${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}
        </p>

        {(() => {
          const pageCount = table.getPageCount()
          const { pageIndex } = table.getState().pagination

          let pages = []

          if (pageCount <= 3) {
            pages = Array.from({ length: pageCount }, (_, i) => i)
          } else {
            if (pageIndex === 0) {
              pages = [0, 1, 2]
            } else if (pageIndex === pageCount - 1) {
              pages = [pageCount - 3, pageCount - 2, pageCount - 1]
            } else {
              pages = [pageIndex - 1, pageIndex, pageIndex + 1]
            }
          }

          return (
            <div
              style={{
                maxWidth:
                  pages.length === 1
                    ? 'calc(calc(40px * 5) + calc(4px * 4))'
                    : pages.length === 2
                      ? 'calc(calc(40px * 6) + calc(4px * 5))'
                      : pages.length === 3
                        ? 'calc(calc(40px * 7) + calc(4px * 6))'
                        : 'calc(calc(40px * 4) + calc(4px * 3))'
              }}
              className={css({
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between'
              })}
            >
              <Button
                variant="ghost"
                aria-label="Ir para a primeira página"
                disabled={!table.getCanPreviousPage()}
                className={css({ padding: 0 })}
                onClick={focusGrid(table.firstPage)}
              >
                <KeyboardDoubleArrowRightIcon
                  className={css({ rotate: '180deg' })}
                />
              </Button>

              <Button
                variant="ghost"
                aria-label="Ir para a página anterior"
                disabled={!table.getCanPreviousPage()}
                className={css({ padding: 0 })}
                onClick={focusGrid(table.previousPage)}
              >
                <KeyboardArrowRightIcon className={css({ rotate: '180deg' })} />
              </Button>

              {pages.map(i => {
                const isCurrentPage = pageIndex === i
                return (
                  <Button
                    key={i}
                    variant={isCurrentPage ? 'solid' : 'ghost'}
                    aria-label={`Página ${i + 1}`}
                    className={css({ padding: 0 })}
                    disabled={isCurrentPage}
                    {...(!isCurrentPage && {
                      onClick: focusGrid(() => table.setPageIndex(i))
                    })}
                  >
                    {i + 1}
                  </Button>
                )
              })}

              <Button
                variant="ghost"
                aria-label="Ir para a próxima página"
                className={css({ padding: 0 })}
                disabled={!table.getCanNextPage()}
                onClick={focusGrid(table.nextPage)}
              >
                <KeyboardArrowRightIcon />
              </Button>

              <Button
                variant="ghost"
                aria-label="Ir para a última página"
                className={css({ padding: 0 })}
                disabled={!table.getCanNextPage()}
                onClick={focusGrid(table.lastPage)}
              >
                <KeyboardDoubleArrowRightIcon />
              </Button>
            </div>
          )
        })()}
      </nav>
    </Fragment>
  )
}
