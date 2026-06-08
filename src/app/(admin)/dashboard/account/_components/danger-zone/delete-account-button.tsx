'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { toaster } from '@/src/components/ui/toast/toast'
import { css } from '@/styled-system/css'
import { deleteAccount } from './actions'

export function DeleteAccountButton() {
  const router = useRouter()

  async function handleDeleteAccount() {
    const result = await deleteAccount()

    if (result.error) {
      toaster.error({
        description: 'Erro ao tentar excluir a conta.'
      })
      return
    }

    toaster.success({
      description: 'Conta excluída.'
    })
    router.push('/')
  }

  return (
    <Button
      variant="solid"
      className={css({
        background: 'error',
        color: 'error.on',
        width: { base: '100%', medium: 'fit-content' },
        _icon: { fill: 'error.on' },
        _notDisabled: {
          _hover: {
            _after: {
              background: 'error.on/8'
            }
          },
          _focusVisible: {
            _after: {
              background: 'error.on/10'
            }
          }
        }
      })}
      onClick={handleDeleteAccount}
    >
      Quero excluir
    </Button>
  )
}
