'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable
} from '@tanstack/react-table'
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
import * as TextInput from '@/src/components/ui/text-input'
import { ToggleGroup } from '@/src/components/ui/toggle-group'
import { formatNumber } from '@/src/utils/format-number'
import { css } from '@/styled-system/css'
import { Order } from '../../page'
import { OrderCard } from './order-card'

export const CHECKOUT_STATUS_FILTERS = [
  {
    value: 'complete',
    label: 'Concluído',
    className: css.raw({ background: 'star.good', color: 'white' })
  },
  {
    value: 'open',
    label: 'Pendente',
    className: css.raw({ background: 'star.ok', color: 'white' })
  },
  {
    value: 'expired',
    label: 'Expirado',
    className: css.raw({ background: 'star.bad', color: 'white' })
  }
] as const

export const PAYMENT_STATUS_FILTERS = [
  {
    value: 'paid',
    label: 'Pago',
    className: css.raw({ background: 'star.good', color: 'white' })
  },
  {
    value: 'unpaid',
    label: 'Não pago',
    className: css.raw({ background: 'star.bad', color: 'white' })
  },
  {
    value: 'no_payment_required',
    label: 'Sem cobrança',
    className: css.raw({ background: 'black.alpha.700', color: 'white' })
  }
] as const

const SORT_BY_FILTERS = [
  { value: 'product-qty', label: 'Quantidade de produtos' },
  { value: 'price', label: 'Preço total' },
  { value: 'shipping', label: 'Preço do frete' },
  { value: 'date', label: 'Data' }
] as const

const SORTING_MODE_FILTERS = [
  { value: 'asc', label: 'Ascendente' },
  { value: 'desc', label: 'Descendente' }
] as const

export const getProductTotal = (raw: Order['order_products']) =>
  raw.reduce((acc, item) => {
    return acc + item.quantity
  }, 0)

export const getOrderTotal = (order: Order) =>
  order.order_products.reduce((sum, p) => sum + p.price_cents * p.quantity, 0) +
  (order.shipping_amount ?? 0)

export const parseShippingAddress = (
  raw: Order['shipping_address']
): {
  rate: string
  address: string
  geohash: string
} | null => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const obj = raw as Record<string, unknown>
  if (typeof obj.address !== 'string') return null
  return {
    rate: String(obj.rate ?? ''),
    address: obj.address,
    geohash: String(obj.geohash ?? '')
  }
}

interface OrderHistoryProps {
  data: Order[]
}
export function OrderHistory({ data }: OrderHistoryProps) {
  'use no memo'

  const gridRef = useRef<HTMLDivElement | null>(null)
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true }
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columns = useMemo<ColumnDef<Order, unknown>[]>(
    () => [
      {
        id: 'checkout-status',
        accessorFn: row => row.status,
        filterFn: 'equals' as const
      },
      {
        id: 'payment-status',
        accessorFn: row => row.payment_status,
        filterFn: 'equals' as const
      },
      {
        id: 'product-qty',
        accessorFn: row => getProductTotal(row.order_products),
        enableSorting: true
      },
      {
        id: 'price',
        accessorFn: row => getOrderTotal(row),
        enableSorting: true
      },
      {
        id: 'shipping',
        accessorFn: row => row.shipping_amount,
        enableSorting: true
      },
      {
        id: 'date',
        accessorFn: row => row.created_at,
        sortingFn: (a, b) =>
          new Date(a.original.created_at ?? '').getTime() -
          new Date(b.original.created_at ?? '').getTime()
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
    globalFilterFn: (row, _columnId, value) => {
      const q = value.toLowerCase()
      const o = row.original
      const address = parseShippingAddress(o.shipping_address)?.address ?? ''
      return (
        o.id.toLowerCase().includes(q) ||
        address.toLowerCase().includes(q) ||
        o.order_products.some(
          p =>
            p.product.name.toLowerCase().includes(q) ||
            p.store.name.toLowerCase().includes(q)
        )
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

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

  const rows = table.getRowModel().rows
  const filteredRows = table.getFilteredRowModel().rows

  const paid = useMemo(
    () => filteredRows.filter(r => r.original.payment_status === 'paid').length,
    [filteredRows]
  )

  const total = useMemo(
    () => filteredRows.reduce((sum, r) => sum + getOrderTotal(r.original), 0),
    [filteredRows]
  )

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
          <TextInput.Label htmlFor="order-filter">
            Busque por pedido, endereço, produto ou loja
          </TextInput.Label>
          <TextInput.Input
            id="order-filter"
            type="search"
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
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
            Situação do pedido
          </legend>

          <ToggleGroup.Root
            onValueChange={({ value }) => {
              table
                .getColumn('checkout-status')
                ?.setFilterValue(value[0] || undefined)
            }}
          >
            {CHECKOUT_STATUS_FILTERS.map(item => (
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
            Situação do pagamento
          </legend>

          <ToggleGroup.Root
            onValueChange={({ value }) => {
              table
                .getColumn('payment-status')
                ?.setFilterValue(value[0] || undefined)
            }}
          >
            {PAYMENT_STATUS_FILTERS.map(item => (
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
            Ordenar por
          </legend>

          <ToggleGroup.Root
            deselectable={false}
            defaultValue={['date']}
            onValueChange={({ value }) => {
              const id = value[0]
              const currentDesc = sorting[0].desc ?? true
              if (id) setSorting([{ id, desc: currentDesc }])
            }}
          >
            {SORT_BY_FILTERS.map(item => (
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
            Forma de ordenação
          </legend>

          <ToggleGroup.Root
            deselectable={false}
            defaultValue={['desc']}
            onValueChange={({ value }) => {
              const currentId = sorting[0].id
              setSorting([{ id: currentId, desc: value[0] === 'desc' }])
            }}
          >
            {SORTING_MODE_FILTERS.map(item => (
              <ToggleGroup.Item key={item.value} value={item.value}>
                {item.label}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </fieldset>

        <div
          className={css({
            display: 'inline-flex',
            alignSelf: 'start',
            gap: '2',
            flexWrap: 'wrap',
            '& p': {
              textStyle: 'sm',
              color: 'surface.on.variant'
            },
            '& strong': { fontWeight: 500 }
          })}
        >
          <p aria-live="polite" aria-atomic="true">
            {filteredRows.length} resultado(s)
          </p>
          <p>
            <strong>{paid}</strong> pago(s)
          </p>
          <p>
            total{' '}
            <strong>
              {formatNumber({
                options: { currency: 'BRL' },
                numberToBeFormatted: total / 100
              })}
            </strong>
          </p>
        </div>
      </div>

      <div
        ref={gridRef}
        tabIndex={-1}
        aria-label="Lista dos pedidos"
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
          rows.map(row => <OrderCard key={row.id} order={row.original} />)
        )}
      </div>

      <nav
        aria-label="Paginação de pedidos"
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
