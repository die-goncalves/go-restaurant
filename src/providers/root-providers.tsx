'use client'

import { ReactNode } from 'react'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PositionProvider } from '../contexts/position-context'
import { FilterProvider } from '../contexts/filter-context'
import { CartProvider } from '../contexts/cart-context'
import { AuthProvider } from '../contexts/auth-context'
import { Notification } from '../components/notification'

export function RootProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <AuthProvider>
      <PositionProvider>
        <FilterProvider>
          <CartProvider>
            <QueryClientProvider client={queryClient}>
              {children}
              <Notification />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </CartProvider>
        </FilterProvider>
      </PositionProvider>
    </AuthProvider>
  )
}
