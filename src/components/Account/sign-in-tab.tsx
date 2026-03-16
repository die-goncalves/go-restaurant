import { useForm } from 'react-hook-form'
import zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '../text-input'
import { Loading } from '../loading'
import { AuthApiError } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/auth-context'
import { css } from '@/styled-system/css'
import { logger } from '@/src/lib/logger'

const log = logger.child({ module: 'client', component: 'SignInTab' })

type FormInputs = {
  email: string
  password: string
}

const schema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Campo obrigatório' })
    .email('Deve ser um e-mail válido.'),
  password: zod.string().min(1, { message: 'Campo obrigatório' })
})

type SignInTabProps = {
  onCloseDialog: () => void
}

export function SignInTab({ onCloseDialog }: SignInTabProps) {
  const { signIn } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: FormInputs): Promise<void> => {
    const submitLog = log.child({ handler: 'onSubmit' })

    const { error } = await signIn({
      email: data.email,
      password: data.password
    })

    if (error) {
      if (error instanceof AuthApiError) {
        if (error.message === 'Invalid login credentials') {
          submitLog.warn('Sign in failed — invalid credentials')
          toast.error('Credenciais de login inválidas')
        } else {
          submitLog.error({ error }, 'Auth API error during sign in')
        }
      } else {
        submitLog.error({ error }, 'Unexpected error during sign in')
      }
      return
    }

    toast.success('Login realizado')
    onCloseDialog()
  }

  return (
    <form
      className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        <label htmlFor="sign-in-email" className={css({ w: 'fit', mb: '2' })}>
          Endereço de e-mail
        </label>
        <TextInput
          {...register('email')}
          hasError={!!errors.email}
          id="sign-in-email"
        />
        {errors.email && (
          <span
            role="alert"
            className={css({ fontSize: 'sm', color: 'light.red.500' })}
          >
            {errors.email?.message}
          </span>
        )}
      </div>

      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        <label
          htmlFor="sign-in-password"
          className={css({ w: 'fit', mb: '2' })}
        >
          Senha
        </label>
        <TextInput
          {...register('password')}
          hasError={!!errors.password}
          id="sign-in-password"
          type="password"
        />
        {errors.password && (
          <span
            role="alert"
            className={css({ fontSize: 'sm', color: 'light.red.500' })}
          >
            {errors.password?.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={css({
          ml: 'auto',
          py: '2',
          px: '4',
          rounded: 'sm',
          bg: 'light.green.200',
          transition: 'background-color 150ms ease-in',
          outline: 'none',
          '&:not(:disabled):hover': { bg: 'light.green.300' },
          _focus: {
            outlineStyle: 'solid',
            outlineWidth: '2',
            outlineOffset: '2',
            outlineColor: 'light.indigo.300'
          },
          ...(isSubmitting && { cursor: 'not-allowed' })
        })}
      >
        {isSubmitting ? (
          <div
            className={css({ display: 'flex', alignItems: 'center', gap: '4' })}
          >
            <Loading />
            <p>Iniciando...</p>
          </div>
        ) : (
          'Iniciar sessão'
        )}
      </button>
    </form>
  )
}
