import '@zag-js/tour'

declare module '@zag-js/tour' {
  interface StepDetails {
    /**
     * The main axis offset or gap between the reference and floating elements
     */
    gutter?: number | undefined
    /**
     * The virtual padding around the viewport edges to check for overflow
     */
    overflowPadding?: number | undefined
  }
}
