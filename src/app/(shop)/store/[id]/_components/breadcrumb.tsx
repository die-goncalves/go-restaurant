'use client'

import { Breadcrumb as BreadcrumbPrimitive } from '@/src/components/ui/breadcrumb'
import { Link } from '@/src/components/ui/link'
import { usePosition } from '@/src/contexts/position-context'

type BreadcrumbProps = {
  name: string | null
  neighborhood: string | null
}
export function Breadcrumb({ name, neighborhood }: BreadcrumbProps) {
  const { state } = usePosition()

  return (
    <BreadcrumbPrimitive.Root>
      <BreadcrumbPrimitive.List>
        <BreadcrumbPrimitive.Item>
          <Link href="/" underline>
            Página inicial
          </Link>
        </BreadcrumbPrimitive.Item>
        <BreadcrumbPrimitive.Separator>/</BreadcrumbPrimitive.Separator>
        <BreadcrumbPrimitive.Item>
          <Link
            href={`/stores?place=${neighborhood}&geohash=${state.currentPosition?.geohash}`}
            underline
          >
            {neighborhood}
          </Link>
        </BreadcrumbPrimitive.Item>
        <BreadcrumbPrimitive.Separator>/</BreadcrumbPrimitive.Separator>
        <BreadcrumbPrimitive.Item isCurrent>
          <Link href="#">{name}</Link>
        </BreadcrumbPrimitive.Item>
      </BreadcrumbPrimitive.List>
    </BreadcrumbPrimitive.Root>
  )
}
