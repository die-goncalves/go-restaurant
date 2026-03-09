'use client'

import { Toaster, toast, ToastBar, resolveValue } from 'react-hot-toast'
import { X } from 'phosphor-react'
import { css } from '@/styled-system/css'

export const Notification = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 5000,
        error: {
          duration: 5000
        },
        success: {
          duration: 3000
        }
      }}
    >
      {t => (
        <div
          className={css({
            overflow: 'hidden',
            rounded: 'sm',
            shadow: 'lg',
            p: '0',
            maxW: 'xs',
            animation: t.visible ? 'enter' : 'leave'
          })}
        >
          <ToastBar toast={t} style={{ all: 'unset', animation: 'none' }}>
            {({ icon, message }) => {
              return (
                <div
                  className={css({
                    display: 'flex',
                    alignItems: 'baseline',
                    boxSizing: 'border-box',
                    p: '3',
                    rounded: 'sm',
                    shadow: 'lg',
                    bg: 'light.gray.100',
                    borderWidth: '2',
                    borderColor:
                      t.type === 'success'
                        ? 'light.green.200'
                        : t.type === 'error'
                          ? 'light.red.200'
                          : 'light.gray.200'
                  })}
                >
                  <div
                    className={css({
                      display: 'flex',
                      w: '6',
                      h: '6',
                      justifyContent: 'center',
                      alignItems: 'center'
                    })}
                  >
                    {icon}
                  </div>

                  <span className={css({ px: '3', fontSize: 'base' })}>
                    {resolveValue(t.message, t)}
                  </span>

                  {t.type !== 'loading' && (
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className={css({
                        p: '1',
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
                      })}
                    >
                      <X
                        className={css({
                          w: '4',
                          h: '4',
                          color: 'light.gray.800'
                        })}
                      />
                    </button>
                  )}
                </div>
              )
            }}
          </ToastBar>
        </div>
      )}
    </Toaster>
  )
}
