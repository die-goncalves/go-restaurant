import { ComponentProps } from 'react'

export function RemoveIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      fill="currentColor"
      {...props}
    >
      <path d="M200-440v-80h560v80H200Z" />
    </svg>
  )
}
