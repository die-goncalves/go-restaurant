import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '../TextInput'
import { Loading } from '../Loading'
import { AuthApiError } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'

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
    const { error } = await signUp({
      email: data.email,
      password: data.password
    })

    if (error) {
      if (error instanceof AuthApiError) {
        if (error.message === 'User already registered') {
          toast.error('Usuário já cadastrado')
        }
      } else {
        console.error(error)
      }
    } else {
      toast.success('Cadastro realizado')
      onCloseDialog()
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <label htmlFor="sign-up-email" className="w-fit mb-2">
          Endereço de e-mail
        </label>
        <TextInput
          {...register('email')}
          hasError={!!errors.email}
          id="sign-up-email"
        />
        {errors.email && (
          <span role="alert" className="text-sm text-light-red-500">
            {errors.email?.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="sign-up-password" className="w-fit mb-2">
          Senha
        </label>
        <TextInput
          {...register('password')}
          hasError={!!errors.password}
          id="sign-up-password"
          type="password"
        />
        {errors.password && (
          <span role="alert" className="text-sm text-light-red-500">
            {errors.password?.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="sign-up-confirm" className="w-fit mb-2">
          Confirme sua senha
        </label>
        <TextInput
          {...register('confirm')}
          hasError={!!errors.confirm}
          id="sign-up-confirm"
          type="password"
        />
        {errors.confirm && (
          <span role="alert" className="text-sm text-light-red-500">
            {errors.confirm?.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={clsx(
          'ml-auto py-2 px-4 rounded bg-light-green-200 [&:not(:disabled):hover]:bg-light-green-300',
          'transition-[background-color] ease-in duration-150',
          'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
          isSubmitting && 'cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-4">
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
