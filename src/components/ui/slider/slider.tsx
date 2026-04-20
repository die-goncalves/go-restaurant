'use client'

import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as slider from '@zag-js/slider'
import { ComponentPropsWithoutRef, forwardRef, ReactNode, useId } from 'react'
import { anatomyPart as parts } from '@/src/theme/recipes/slider'
import { cx } from '@/styled-system/css'
import { slider as sliderRecipe } from '@/styled-system/recipes/slider'
import { SliderProvider, useSliderContext } from './use-slider-context'

type RootInnerProps = ComponentPropsWithoutRef<'div'>
const RootInner = forwardRef<HTMLDivElement, RootInnerProps>(
  (props, forwardedRef) => {
    const { getRootProps } = useSliderContext()
    const style = sliderRecipe()
    const { className, ...mergedProps } = mergeProps(getRootProps(), props)
    const mergedClassName = cx(style, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
RootInner.displayName = 'Slider.RootInner'

type RootProps = Partial<slider.Props> & {
  children: ReactNode | (({ value }: Pick<slider.Api, 'value'>) => ReactNode)
}
export const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, id, ...props }, forwardedRef) => {
    const clientId = useId()
    const rootId = id ?? clientId

    const machineProps = {
      id: rootId,
      ...props
    } as slider.Props

    const service = useMachine(slider.machine, machineProps)
    const api = slider.connect(service, normalizeProps)

    return (
      <SliderProvider {...api}>
        <RootInner ref={forwardedRef}>
          {typeof children === 'function'
            ? children({ value: api.value })
            : children}
        </RootInner>
      </SliderProvider>
    )
  }
)
Root.displayName = 'Slider.Root'

type LabelProps = ComponentPropsWithoutRef<'label'>
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (props, forwardedRef) => {
    const { getLabelProps } = useSliderContext()
    const { className, ...mergedProps } = mergeProps(getLabelProps(), props)

    return <label {...mergedProps} className={className} ref={forwardedRef} />
  }
)
Label.displayName = 'Slider.Label'

type ValueTextProps = ComponentPropsWithoutRef<'output'>
export const ValueText = forwardRef<HTMLOutputElement, ValueTextProps>(
  (props, forwardedRef) => {
    const { getValueTextProps } = useSliderContext()
    const { className, ...mergedProps } = mergeProps(getValueTextProps(), props)

    return <output {...mergedProps} className={className} ref={forwardedRef} />
  }
)
ValueText.displayName = 'Slider.ValueText'

type ControlProps = ComponentPropsWithoutRef<'div'>
export const Control = forwardRef<HTMLDivElement, ControlProps>(
  (props, forwardedRef) => {
    const { getControlProps } = useSliderContext()
    const { className, ...mergedProps } = mergeProps(getControlProps(), props)

    return <div {...mergedProps} className={className} ref={forwardedRef} />
  }
)
Control.displayName = 'Slider.Control'

type TrackProps = ComponentPropsWithoutRef<'div'>
export const Track = forwardRef<HTMLDivElement, TrackProps>(
  (props, forwardedRef) => {
    const { getTrackProps } = useSliderContext()
    const { className, ...mergedProps } = mergeProps(getTrackProps(), props)

    return <div {...mergedProps} className={className} ref={forwardedRef} />
  }
)
Track.displayName = 'Slider.Track'

type RangeProps = ComponentPropsWithoutRef<'div'>
export const Range = forwardRef<HTMLDivElement, RangeProps>(
  (props, forwardedRef) => {
    const { getRangeProps } = useSliderContext()
    const { className, ...mergedProps } = mergeProps(getRangeProps(), props)
    return <div {...mergedProps} className={className} ref={forwardedRef} />
  }
)
Range.displayName = 'Slider.Range'

type InactiveRangeProps = ComponentPropsWithoutRef<'div'>
export const InactiveRange = forwardRef<HTMLDivElement, InactiveRangeProps>(
  (props, forwardedRef) => {
    const { getRangeProps } = useSliderContext()

    const {
      id,
      dir,
      'data-orientation': orientation,
      'data-disabled': disabled,
      'data-invalid': invalid
    } = getRangeProps() as ReturnType<typeof getRangeProps> & {
      'data-orientation'?: 'horizontal' | 'vertical'
      'data-disabled'?: ''
      'data-invalid'?: ''
    }
    return (
      <div
        {...props}
        id={id?.replace(':range', ':inactive-range')}
        {...parts.inactiveRange.attrs}
        dir={dir}
        data-orientation={orientation}
        data-disabled={disabled}
        data-invalid={invalid}
        ref={forwardedRef}
      />
    )
  }
)
InactiveRange.displayName = 'Slider.InactiveRange'

type ThumbProps = ComponentPropsWithoutRef<'div'> & slider.ThumbProps
export const Thumb = forwardRef<HTMLDivElement, ThumbProps>(
  ({ index, name, ...props }, forwardedRef) => {
    const { getThumbProps } = useSliderContext()
    const { className, ...mergedProps } = mergeProps(
      getThumbProps({ index, name }),
      props
    )

    return <div {...mergedProps} className={className} ref={forwardedRef} />
  }
)
Thumb.displayName = 'Slider.Thumb'

type HiddenInputProps = ComponentPropsWithoutRef<'input'> & slider.ThumbProps
export const HiddenInput = forwardRef<HTMLInputElement, HiddenInputProps>(
  ({ index, name, ...props }, forwardedRef) => {
    const { getHiddenInputProps } = useSliderContext()
    const { className, ...mergedProps } = mergeProps(
      getHiddenInputProps({ index, name }),
      props
    )

    return <input {...mergedProps} className={className} ref={forwardedRef} />
  }
)
HiddenInput.displayName = 'Slider.HiddenInput'

type MarkerGroupProps = ComponentPropsWithoutRef<'div'>
export const MarkerGroup = forwardRef<HTMLDivElement, MarkerGroupProps>(
  (props, forwardedRef) => {
    const { getMarkerGroupProps } = useSliderContext()
    const { className, ...mergedProps } = mergeProps(
      getMarkerGroupProps(),
      props
    )

    return <div {...mergedProps} className={className} ref={forwardedRef} />
  }
)
MarkerGroup.displayName = 'Slider.MarkerGroup'

type MarkerProps = ComponentPropsWithoutRef<'span'> & slider.MarkerProps
export const Marker = forwardRef<HTMLSpanElement, MarkerProps>(
  ({ value, ...props }, forwardedRef) => {
    const { getMarkerProps } = useSliderContext()
    const { className, ...mergedProps } = mergeProps(
      getMarkerProps({ value }),
      props
    )

    return <span {...mergedProps} className={className} ref={forwardedRef} />
  }
)
Marker.displayName = 'Slider.Marker'
