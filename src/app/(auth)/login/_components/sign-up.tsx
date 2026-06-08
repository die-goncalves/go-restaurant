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

const log = logger.child({ module: 'client', component: 'SignUp' })

z.config(pt())

const schema = z
  .object({
    email: z.email(),
    password: z.string().min(6),
    confirm: z.string().min(6)
  })
  .refine(data => data.password === data.confirm, {
    message: 'As senhas não são iguais',
    path: ['confirm']
  })
type Schema = z.infer<typeof schema>

type SignUpProps = {
  redirectTo: string
}

export function SignUp({ redirectTo }: SignUpProps) {
  const { signUp } = useAuth()
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
      password: '',
      confirm: ''
    }
  })

  const onSubmit = async (data: Schema): Promise<void> => {
    const submitLog = log.child({ handler: 'onSubmit' })

    const { error } = await signUp({
      email: data.email,
      password: data.password
    })

    if (error) {
      if (error instanceof AuthApiError) {
        if (error.code === 'user_already_exists') {
          submitLog.warn('Sign up failed — user already registered')
          setError('root', { message: 'Seu cadastro não pôde ser realizado' })
        } else {
          submitLog.error({ error }, 'Auth API error during sign up')
          setError('root', {
            message:
              'Não foi possível cadastrar. Tente novamente em alguns instantes'
          })
        }
      } else {
        submitLog.error({ error }, 'Unexpected error during sign up')
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
      aria-label="Criar conta"
      className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput.Root>
        <TextInput.Label htmlFor="sign-up-email">
          Endereço de e-mail
        </TextInput.Label>
        <TextInput.Input
          {...register('email', {
            onChange() {
              clearErrors('root')
            }
          })}
          id="sign-up-email"
          aria-invalid={!!(errors.email || errors.root)}
          aria-describedby={
            [
              errors.email ? 'sign-up-email-error' : null,
              errors.root ? 'sign-up-root-error' : null
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
        />
        {errors.email && (
          <TextInput.Error
            id="sign-up-email-error"
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
        <TextInput.Label htmlFor="sign-up-password">Senha</TextInput.Label>
        <TextInput.Input
          {...register('password', {
            onChange() {
              clearErrors('root')
            }
          })}
          id="sign-up-password"
          type="password"
          aria-invalid={!!(errors.password || errors.root)}
          aria-describedby={
            [
              errors.password ? 'sign-up-password-error' : null,
              errors.root ? 'sign-up-root-error' : null
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
        />
        {errors.password && (
          <TextInput.Error id="sign-up-password-error">
            {errors.password.message}
          </TextInput.Error>
        )}
      </TextInput.Root>

      <TextInput.Root>
        <TextInput.Label htmlFor="sign-up-confirm">
          Confirme sua senha
        </TextInput.Label>
        <TextInput.Input
          {...register('confirm', {
            onChange() {
              clearErrors('root')
            }
          })}
          id="sign-up-confirm"
          type="password"
          aria-invalid={!!(errors.confirm || errors.root)}
          aria-describedby={
            [
              errors.confirm ? 'sign-up-confirm-error' : null,
              errors.root ? 'sign-up-root-error' : null
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
        />
        {errors.confirm && (
          <TextInput.Error id="sign-up-confirm-error">
            {errors.confirm.message}
          </TextInput.Error>
        )}
      </TextInput.Root>

      {errors.root && (
        <span
          id="sign-up-root-error"
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
            <p>Criando...</p>
          </div>
        ) : (
          'Criar conta'
        )}
      </Button>
    </form>
  )
}
