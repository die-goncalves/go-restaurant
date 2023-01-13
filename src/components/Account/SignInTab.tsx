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
    const { error } = await signIn({
      email: data.email,
      password: data.password
    })

    if (error) {
      if (error instanceof AuthApiError) {
        if (error.message === 'Invalid login credentials') {
          toast.error('Credenciais de login inválidas')
        }
      } else {
        console.error(error)
      }
    } else {
      toast.success('Login realizado')
      onCloseDialog()
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <label htmlFor="sign-in-email" className="w-fit mb-2">
          Endereço de e-mail
        </label>
        <TextInput
          {...register('email')}
          hasError={!!errors.email}
          id="sign-in-email"
        />
        {errors.email && (
          <span role="alert" className="text-sm text-light-red-500">
            {errors.email?.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="sign-in-password" className="w-fit mb-2">
          Senha
        </label>
        <TextInput
          {...register('password')}
          hasError={!!errors.password}
          id="sign-in-password"
          type="password"
        />
        {errors.password && (
          <span role="alert" className="text-sm text-light-red-500">
            {errors.password?.message}
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
            <p>Iniciando...</p>
          </div>
        ) : (
          'Iniciar sessão'
        )}
      </button>
    </form>
  )
}
