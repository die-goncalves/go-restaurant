'use client'

import * as marquee from '@zag-js/marquee'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import { mergeRefs } from '@/src/utils/merge-refs'
import { cx } from '@/styled-system/css'
import { marquee as marqueeRecipe } from '@/styled-system/recipes/marquee'
import { MarqueeProvider, useMarqueeContext } from './use-marquee-context'

type RootProps = ComponentPropsWithoutRef<'div'> & Partial<marquee.Props>
export const Root = forwardRef<HTMLDivElement, RootProps>(
  (props, forwardedRef) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const offsetRef = useRef(0)
    const [marqueeProps, localProps] = marquee.splitProps(props)

    const machineProps = {
      id: useId(),
      ...marqueeProps
    } as marquee.Props

    const service = useMachine(marquee.machine, machineProps)
    const api = marquee.connect(service, normalizeProps)

    const style = marqueeRecipe({})
    const { className, ...mergedProps } = mergeProps(
      api.getRootProps(),
      localProps
    )
    const mergedClassName = cx(style, className)

    const centerElement = useCallback((target: HTMLDivElement) => {
      const root = rootRef.current
      if (!root) return

      const rootCenter =
        root.getBoundingClientRect().left + root.offsetWidth / 2
      const targetCenter =
        target.getBoundingClientRect().left + target.offsetWidth / 2
      const delta = rootCenter - targetCenter
      offsetRef.current += delta
      root.style.setProperty('--marquee-offset', `${offsetRef.current}px`)
    }, [])

    return (
      <MarqueeProvider {...api}>
        <div
          {...mergedProps}
          onFocusCapture={evt => {
            evt.preventDefault()
            api.pause()

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                centerElement(evt.target as HTMLDivElement)
              })
            })
          }}
          onBlurCapture={evt => {
            evt.preventDefault()
            api.resume()
          }}
          className={mergedClassName}
          ref={mergeRefs(forwardedRef, rootRef)}
        />
      </MarqueeProvider>
    )
  }
)
Root.displayName = 'Marquee.Root'

type EdgeProps = ComponentPropsWithoutRef<'div'> & marquee.EdgeProps
export const Edge = forwardRef<HTMLDivElement, EdgeProps>(
  ({ side, ...props }, forwardedRef) => {
    const { getEdgeProps } = useMarqueeContext()
    const { className, ...mergedProps } = mergeProps(
      getEdgeProps({ side }),
      props
    )

    return <div {...mergedProps} className={className} ref={forwardedRef} />
  }
)
Edge.displayName = 'Marquee.Edge'

type ViewportProps = ComponentPropsWithoutRef<'div'>
export const Viewport = forwardRef<HTMLDivElement, ViewportProps>(
  (props, forwardedRef) => {
    const { getViewportProps } = useMarqueeContext()
    const { className, children, ...mergedProps } = mergeProps(
      getViewportProps(),
      props
    )

    return (
      <div {...mergedProps} className={className} ref={forwardedRef}>
        {children}
      </div>
    )
  }
)
Viewport.displayName = 'Marquee.Viewport'

type ContentProps = ComponentPropsWithoutRef<'div'>
export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, ...props }, forwardedRef) => {
    const { getContentProps, contentCount } = useMarqueeContext()

    const [initialCount] = useState(() => contentCount)
    const ready = contentCount !== initialCount

    const middleIndex = Math.floor(contentCount / 2)

    const cloneElements = useMemo(() => {
      if (!ready) return []

      return Array.from({ length: contentCount }).map((_, index) => {
        const cloneIndex = index + 1

        const { className, ...mergedProps } = mergeProps(
          getContentProps({ index: cloneIndex }),
          props
        )

        return (
          <div
            key={cloneIndex}
            {...mergedProps}
            className={className}
            inert
            data-ready=""
          >
            {children}
          </div>
        )
      })
    }, [contentCount, children, getContentProps, props, ready])

    const original = useMemo(() => {
      const { className, ...mergedProps } = mergeProps(
        getContentProps({ index: 0 }),
        props
      )
      return (
        <div
          {...mergedProps}
          className={className}
          ref={forwardedRef}
          data-ready={ready ? '' : undefined}
        >
          {children}
        </div>
      )
    }, [children, forwardedRef, getContentProps, props, ready])

    return (
      <>
        {cloneElements.slice(0, middleIndex)}
        {original}
        {cloneElements.slice(middleIndex)}
      </>
    )
  }
)
Content.displayName = 'Marquee.Content'

type ItemProps = ComponentPropsWithoutRef<'div'>
export const Item = forwardRef<HTMLDivElement, ItemProps>(
  (props, forwardedRef) => {
    const { getItemProps } = useMarqueeContext()
    const { className, ...mergedProps } = mergeProps(getItemProps(), props)

    return <div {...mergedProps} className={className} ref={forwardedRef} />
  }
)
Item.displayName = 'Marquee.Item'
