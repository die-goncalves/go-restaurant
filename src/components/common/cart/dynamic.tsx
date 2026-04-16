import dynamic from 'next/dynamic'
import { LocalMallIcon } from '@/src/components/icons/local-mall'
import { Button } from '@/src/components/ui/button'

export const DynamicCart = dynamic(
  () => import('./index').then(m => ({ default: m.Cart })),
  {
    ssr: false,
    loading: () => (
      <Button icon={<LocalMallIcon />} iconPlacement="left" variant="ghost">
        0 produtos
      </Button>
    )
  }
)
