'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AuthApiError } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { pt } from 'zod/locales'
import { Loading } from '@/src/components/common/loading'
import { Button } from '@/src/components/ui/button'
import * as TextInput from '@/src/components/ui/text-input'
import { useAuth } from '@/src/contexts/auth-context'
import { logger } from '@/src/lib/logger'
import { css } from '@/styled-system/css'

const log = logger.child({ module: 'client', component: 'SignIn' })

z.config(pt())

const schema = z.object({
  email: z.email(),
  password: z.string().min(1)
})
type Schema = z.infer<typeof schema>

type SignInProps = {
  redirectTo: string
}

export function SignIn({ redirectTo }: SignInProps) {
  const { signIn } = useAuth()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: Schema): Promise<void> => {
    const submitLog = log.child({ handler: 'onSubmit' })

    const { error } = await signIn({
      email: data.email,
      password: data.password
    })

    if (error) {
      if (error instanceof AuthApiError) {
        if (error.code === 'invalid_credentials') {
          submitLog.warn('Sign in failed — invalid credentials')
          setError('root', { message: 'Credenciais de login inválidas' })
        } else {
          submitLog.error({ error }, 'Auth API error during sign in')
          setError('root', {
            message:
              'Não foi possível entrar. Tente novamente em alguns instantes'
          })
        }
      } else {
        submitLog.error({ error }, 'Unexpected error during sign in')
        setError('root', {
          message:
            'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte'
        })
      }
      return
    }

    reset()
    router.push(redirectTo)
  }

  return (
    <form
      aria-label="Entrar na conta"
      className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput.Root>
        <TextInput.Label htmlFor="sign-in-email">
          Endereço de e-mail
        </TextInput.Label>
        <TextInput.Input
          {...register('email', {
            onChange() {
              clearErrors('root')
            }
          })}
          id="sign-in-email"
          aria-invalid={!!(errors.email || errors.root)}
          aria-describedby={
            [
              errors.email ? 'sign-in-email-error' : null,
              errors.root ? 'sign-in-root-error' : null
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
        />
        {errors.email && (
          <TextInput.Error
            id="sign-in-email-error"
            className={css({
              display: 'inline-block',
              _firstLetter: { textTransform: 'uppercase' }
            })}
          >
            {errors.email.message}
          </TextInput.Error>
        )}
      </TextInput.Root>

      <TextInput.Root>
        <TextInput.Label htmlFor="sign-in-password">Senha</TextInput.Label>
        <TextInput.Input
          {...register('password', {
            onChange() {
              clearErrors('root')
            }
          })}
          id="sign-in-password"
          type="password"
          aria-invalid={!!(errors.password || errors.root)}
          aria-describedby={
            [
              errors.password ? 'sign-in-password-error' : null,
              errors.root ? 'sign-in-root-error' : null
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
        />
        {errors.password && (
          <TextInput.Error id="sign-in-password-error">
            {errors.password.message}
          </TextInput.Error>
        )}
      </TextInput.Root>

      {errors.root && (
        <span
          id="sign-in-root-error"
          role="alert"
          className={css({
            display: 'inline-flex',
            color: 'error',
            textStyle: 'sm'
          })}
        >
          {errors.root.message}
        </span>
      )}

      <Button
        variant="solid"
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className={css({ width: '100%' })}
      >
        {isSubmitting ? (
          <div
            className={css({ display: 'flex', alignItems: 'center', gap: '2' })}
          >
            <Loading />
            <p>Iniciando...</p>
          </div>
        ) : (
          'Iniciar sessão'
        )}
      </Button>
    </form>
  )
}
