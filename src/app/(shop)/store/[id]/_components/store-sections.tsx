'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { css } from '@/styled-system/css'
import type { Product, Store } from '../page'
import { ProductCard } from './product-card'

type StoreSectionsProps = {
  store: Pick<Store, 'id' | 'image_url' | 'name'>
  products: Product[]
}

export function StoreSections({ store, products }: StoreSectionsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const navRef = useRef<HTMLDivElement>(null)
  const isClickRef = useRef(false)

  useEffect(() => {
    const entriesMap = new Map<Element, IntersectionObserverEntry>()

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => entriesMap.set(e.target, e))
        if (isClickRef.current) return

        const firstVisible = sectionRefs.current.findIndex(
          el => el && entriesMap.get(el)?.isIntersecting
        )
        if (firstVisible !== -1) setActiveIndex(firstVisible)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 }
    )

    sectionRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const nav = navRef.current
    const btn = btnRefs.current[activeIndex]
    if (!nav || !btn) return
    nav.scrollTo({
      left: btn.offsetLeft - nav.offsetWidth / 2 + btn.offsetWidth / 2,
      behavior: 'smooth'
    })
  }, [activeIndex])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    let startX = 0
    let scrollLeft = 0
    let isDragging = false
    let moved = false

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      moved = false
      startX = e.pageX - nav.offsetLeft
      scrollLeft = nav.scrollLeft
      nav.style.cursor = 'grabbing'
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const x = e.pageX - nav.offsetLeft
      const dist = x - startX
      if (Math.abs(dist) > 4) moved = true
      nav.scrollLeft = scrollLeft - dist
    }

    const onMouseUp = () => {
      isDragging = false
      nav.style.cursor = 'grab'
    }

    const onClickCapture = (e: MouseEvent) => {
      if (moved) e.stopPropagation()
    }

    nav.addEventListener('mousedown', onMouseDown)
    nav.addEventListener('click', onClickCapture, true)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      nav.removeEventListener('mousedown', onMouseDown)
      nav.removeEventListener('click', onClickCapture, true)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  function scrollToSection(index: number) {
    isClickRef.current = true
    setActiveIndex(index)

    const el = sectionRefs.current[index]
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 24
      window.scrollTo({ top, behavior: 'smooth' })
    }

    setTimeout(() => {
      isClickRef.current = false
    }, 500)
  }

  const sections = useMemo(() => {
    const menu = products.reduce<
      Record<string, { id: string; name: string }[]>
    >((acc, product, index) => {
      const id = String(index + 1)

      product.sections.forEach(section => {
        acc[section] ??= []
        acc[section].push({ id, name: product.name })
      })

      return acc
    }, {})
    const sortedMenu = (
      Object.entries(menu) as [string, { id: string; name: string }[]][]
    )
      .map(
        ([section, products]) =>
          [
            section,
            [...products].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
          ] as [string, { id: string; name: string }[]]
      )
      .sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'))

    return sortedMenu
  }, [products])

  return (
    <div className={css({ paddingBlockStart: '8' })}>
      <div
        className={css({
          width: '100%',
          position: 'sticky',
          top: 0,
          background: 'surface',
          zIndex: 'sticky'
        })}
      >
        <div
          ref={navRef}
          className={css({
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            gap: '4',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            paddingBlock: '2',
            paddingInline: { base: '4', medium: '6', expanded: '8' }
          })}
        >
          {sections.map(([key, _section], id) => (
            <Button
              variant={activeIndex === id ? 'solid' : 'ghost'}
              key={key}
              ref={el => {
                btnRefs.current[id] = el
              }}
              onClick={() => scrollToSection(id)}
            >
              {key}
            </Button>
          ))}
        </div>
      </div>

      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          alignItems: 'flex-start',
          zIndex: 0,
          paddingBlockEnd: { base: '4', medium: '6', expanded: '8' },
          paddingInline: { base: '4', medium: '6', expanded: '8' }
        })}
      >
        {sections.map(([key, _section], id) => {
          const productsBySection = products.filter(p =>
            p.sections.includes(key)
          )
          return (
            <section
              key={`section-${key}`}
              id={`section-${key}`}
              className={css({ width: '100%' })}
              ref={el => {
                sectionRefs.current[id] = el
              }}
            >
              <h2
                className={css({
                  fontSize: '2xl',
                  paddingBlockStart: '8',
                  paddingBlockEnd: '4'
                })}
              >
                {key}
              </h2>
              <div
                className={css({
                  display: 'grid',
                  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                  gap: '4',
                  medium: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
                  expanded: {
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '6'
                  }
                })}
              >
                {productsBySection.map(p => (
                  <ProductCard
                    key={p.id}
                    store={{
                      id: store.id!,
                      name: store.name!,
                      imageURL: store.image_url!
                    }}
                    product={p}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
