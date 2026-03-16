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

const log = logger.child({ module: 'client', component: 'SignUpTab' })

type FormInputs = {
  email: string
  password: string
  confirm: string
}

const schema = zod
  .object({
    email: zod
      .string()
      .min(1, { message: 'Campo obrigatório' })
      .email('Deve ser um e-mail válido.'),
    password: zod
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    confirm: zod
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  })
  .refine(data => data.password === data.confirm, {
    message: 'As senhas não são iguais',
    path: ['confirm']
  })

const fieldWrapper = css({ display: 'flex', flexDirection: 'column' })
const fieldLabel = css({ w: 'fit', mb: '2' })
const fieldError = css({ fontSize: 'sm', color: 'light.red.500' })

type SignUpTabProps = {
  onCloseDialog: () => void
}
export function SignUpTab({ onCloseDialog }: SignUpTabProps) {
  const { signUp } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirm: ''
    }
  })

  const onSubmit = async (data: FormInputs): Promise<void> => {
    const submitLog = log.child({ handler: 'onSubmit' })

    const { error } = await signUp({
      email: data.email,
      password: data.password
    })

    if (error) {
      if (error instanceof AuthApiError) {
        if (error.message === 'User already registered') {
          submitLog.warn('Sign up failed — user already registered')
          toast.error('Usuário já cadastrado')
        } else {
          submitLog.error({ error }, 'Auth API error during sign up')
        }
      } else {
        submitLog.error({ error }, 'Unexpected error during sign up')
      }
      return
    }

    toast.success('Cadastro realizado')
    onCloseDialog()
  }

  return (
    <form
      className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={fieldWrapper}>
        <label htmlFor="sign-up-email" className={fieldLabel}>
          Endereço de e-mail
        </label>
        <TextInput
          {...register('email')}
          hasError={!!errors.email}
          id="sign-up-email"
        />
        {errors.email && (
          <span role="alert" className={fieldError}>
            {errors.email?.message}
          </span>
        )}
      </div>

      <div className={fieldWrapper}>
        <label htmlFor="sign-up-password" className={fieldLabel}>
          Senha
        </label>
        <TextInput
          {...register('password')}
          hasError={!!errors.password}
          id="sign-up-password"
          type="password"
        />
        {errors.password && (
          <span role="alert" className={fieldError}>
            {errors.password?.message}
          </span>
        )}
      </div>

      <div className={fieldWrapper}>
        <label htmlFor="sign-up-confirm" className={fieldLabel}>
          Confirme sua senha
        </label>
        <TextInput
          {...register('confirm')}
          hasError={!!errors.confirm}
          id="sign-up-confirm"
          type="password"
        />
        {errors.confirm && (
          <span role="alert" className={fieldError}>
            {errors.confirm?.message}
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
            <p>Criando...</p>
          </div>
        ) : (
          'Criar conta'
        )}
      </button>
    </form>
  )
}
