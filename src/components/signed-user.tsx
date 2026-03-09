'use client'

import { SignOut, User, UserGear } from 'phosphor-react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { Popover } from './popover'
import { useAuth } from '../contexts/auth-context'
import toast from 'react-hot-toast'
import { css, cx } from '@/styled-system/css'

const menuItem = css({
  py: '2',
  px: '4',
  rounded: 'sm',
  bg: 'light.gray.200',
  transition: 'background-color 150ms ease-in',
  outline: 'none',
  '&:not(:disabled):hover': { bg: 'light.gray.300' },
  _focus: {
    outlineStyle: 'solid',
    outlineWidth: '2',
    outlineOffset: '2',
    outlineColor: 'light.indigo.300'
  }
})

const menuItemInner = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4'
})

const iconStyle = css({ w: '6', h: '6', color: 'light.gray.800' })

export function SignedUser() {
  const router = useRouter()
  const { session, signOut } = useAuth()

  async function handleSignOut() {
    const { error } = await signOut()
    if (error) {
      toast.error(error.message)
    } else {
      router.push('/')
    }
  }

  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        xs: {
          rounded: 'sm',
          shadow: '[inset_0px_-2px_0px_0px_#d6d3d1]'
        }
      })}
    >
      <span
        className={css({
          px: '2',
          display: 'none',
          xs: { display: 'inline' }
        })}
      >
        {session?.user.email}
      </span>
      <Popover.Root>
        <Popover.Trigger>
          <button
            className={css({
              display: 'flex',
              w: '10',
              h: '10',
              justifyContent: 'center',
              alignItems: 'center',
              rounded: 'sm',
              bg: 'light.gray.200',
              transition: 'background-color 150ms ease-in',
              outline: 'none',
              '&:not(:disabled):hover': { bg: 'light.gray.300' },
              _focus: {
                outlineStyle: 'solid',
                outlineWidth: '2',
                outlineOffset: '2',
                outlineColor: 'light.indigo.300'
              },
              xs: {
                boxSizing: 'border-box',
                borderWidth: '2',
                borderColor: 'light.gray.300'
              }
            })}
          >
            <User
              className={css({
                m: 'auto',
                w: '6',
                h: '6',
                color: 'light.gray.800'
              })}
            />
          </button>
        </Popover.Trigger>

        <Popover.Content
          sideOffset={8}
          className={cx(css({ p: '4', w: '60', zIndex: '2' }))}
        >
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2'
            })}
          >
            <span
              className={css({
                display: 'flex',
                rounded: 'sm',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'medium',
                h: '10',
                borderWidth: '2',
                borderColor: 'light.gray.200',
                xs: { display: 'none' }
              })}
            >
              {session?.user.email}
            </span>
            <NextLink href="/dashboard/profile" className={menuItem}>
              <div className={menuItemInner}>
                <UserGear className={iconStyle} />
                <p>Painel de controle</p>
              </div>
            </NextLink>
            <button onClick={handleSignOut} className={menuItem}>
              <div className={menuItemInner}>
                <SignOut className={iconStyle} />
                <p>Sair</p>
              </div>
            </button>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}
