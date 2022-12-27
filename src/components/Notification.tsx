import React from 'react'
import clsx from 'clsx'
import { Toaster, toast, ToastBar, resolveValue } from 'react-hot-toast'
import { X } from 'phosphor-react'

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
          className={clsx(
            'overflow-hidden rounded shadow-lg p-0 max-w-xs',
            t.visible ? 'animate-enter' : 'animate-leave'
          )}
        >
          <ToastBar toast={t} style={{ all: 'unset', animation: 'none' }}>
            {({ icon, message }) => {
              return (
                <div
                  className={clsx(
                    'flex items-baseline box-border p-3 rounded shadow-lg bg-light-gray-100 border-2 border-light-gray-200',
                    t.type === 'success' && 'border-light-green-200',
                    t.type === 'error' && 'border-light-red-200'
                  )}
                >
                  <div className="flex w-6 h-6 justify-center items-center">
                    {icon}
                  </div>

                  <span className="px-3 text-base">
                    {resolveValue(t.message, t)}
                  </span>

                  {t.type !== 'loading' && (
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className={clsx(
                        'p-1 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                        'transition-[background-color] ease-in duration-150',
                        'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                      )}
                    >
                      <X className="w-4 h-4 text-light-gray-800" />
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
