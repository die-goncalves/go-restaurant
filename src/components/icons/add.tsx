import { ComponentProps } from 'react'

export function AddIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      fill="currentColor"
      {...props}
    >
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>
  )
}
