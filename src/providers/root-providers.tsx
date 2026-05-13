'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useState } from 'react'
import { Toaster } from '../components/ui/toast/toast'
import { AuthProvider } from '../contexts/auth-context'
import { CartProvider } from '../contexts/cart-context'
import { FilterProvider } from '../contexts/filter-context'
import { PositionProvider } from '../contexts/position-context'

export function RootProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <AuthProvider>
      <PositionProvider>
        <FilterProvider>
          <CartProvider>
            <QueryClientProvider client={queryClient}>
              {children}
              <Toaster />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </CartProvider>
        </FilterProvider>
      </PositionProvider>
    </AuthProvider>
  )
}
