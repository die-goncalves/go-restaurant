import { ReactNode } from 'react'

type TextTagProps = {
  children: ReactNode
}
export function TextTag({ children }: TextTagProps) {
  return (
    <span className="flex items-center text-sm px-3 rounded w-max h-6 bg-light-orange-200">
      {children}
    </span>
  )
}
