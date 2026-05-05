'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/src/components/ui/button'
import { css } from '@/styled-system/css'
import { deleteAccount } from './actions'

export function DeleteAccountButton() {
  const router = useRouter()

  async function handleDeleteAccount() {
    const result = await deleteAccount()

    if (result.error) {
      toast.error('Erro ao tentar excluir a conta')
      return
    }

    toast.success('Conta excluída')
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
