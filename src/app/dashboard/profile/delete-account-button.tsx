'use client'

import { css } from '@/styled-system/css'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { deleteAccount } from './actions'

const dialogButton = css.raw({
  py: '2',
  px: '4',
  rounded: 'sm',
  transition: 'background-color 150ms ease-in',
  outline: 'none',
  _focus: {
    outlineStyle: 'solid',
    outlineWidth: '2',
    outlineOffset: '2',
    outlineColor: 'light.indigo.300'
  }
})

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
    <button
      className={css([
        dialogButton,
        {
          bg: 'light.red.200',
          '&:not(:disabled):hover': { bg: 'light.red.300' },
          _disabled: { cursor: 'not-allowed', opacity: '0.8' }
        }
      ])}
      onClick={handleDeleteAccount}
    >
      Quero excluir
    </button>
  )
}
