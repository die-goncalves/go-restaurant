import clsx from 'clsx'
import { useState } from 'react'
import { CaretLeft, Info, X } from 'phosphor-react'
import { Root, Trigger, Content, Close, Portal } from '@radix-ui/react-dialog'
import * as Switch from '@radix-ui/react-switch'

export function Help() {
  const [isCompact, setIsCompact] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <button
          className={clsx(
            'flex items-center fixed bottom-4 bg-light-orange-200 [&:not(:disabled):hover]:bg-light-orange-300 z-10 rounded-full h-14 w-14 shadow-md',
            'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
            'transition-all ease-in duration-150',
            'hover:shadow-xl',
            isCompact
              ? 'pl-2 -right-6'
              : 'justify-center right-4 hover:-translate-y-2'
          )}
          onClick={e => {
            if (isCompact) {
              e.preventDefault()
              setIsCompact(false)
            }
          }}
        >
          {isCompact ? (
            <CaretLeft className="w-6 h-6 text-light-gray-800" weight="bold" />
          ) : (
            <span className="text-3xl">?</span>
          )}
        </button>
      </Trigger>

      <Portal>
        <Content
          className={clsx(
            'md:w-[432px] md:h-[560px] md:overflow-hidden',
            'flex flex-col h-[calc(100vh-104px)] w-[calc(100vw-2rem)] overflow-auto bg-light-gray-100 rounded fixed bottom-0 right-0 focus:outline-none -translate-x-4 -translate-y-[5.5rem] shadow-xl z-30'
          )}
        >
          <header className="flex p-4 items-center justify-between">
            <p className="text-xl font-medium">Instruções de uso</p>
            <Close asChild>
              <button
                className={clsx(
                  'p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                  'transition-[background-color, outline] ease-in duration-150',
                  'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                )}
              >
                <X className="w-6 h-6" />
              </button>
            </Close>
          </header>
          <main
            className={clsx(
              'md:pr-0 md:overflow-auto md:scrollbar-gutter-stable',
              'flex flex-col gap-4 px-4'
            )}
          >
            <div>
              <p className="text-lg">Login e cadastro</p>
              <ul className="list-disc list-inside">
                <li>
                  <span>
                    Você pode cadastrar qualquer e-mail para testar o site, nem
                    precisa existir apenas ser válido. Se quiser pode usar este
                    cadastro:
                  </span>
                  <div className="flex flex-col w-max rounded p-2 bg-light-gray-200 border-2 border-light-gray-300">
                    <span>E-mail: fulano@dominio.com</span>{' '}
                    <span>Senha: 123456</span>{' '}
                  </div>
                </li>
                <li>
                  Há opção para excluir conta, mas se você optou por usar o
                  e-mail de exemplo acima por favor não exclua.
                </li>
              </ul>
            </div>

            <div>
              <p className="text-lg">Pagamentos</p>

              <ul className="list-disc list-inside">
                <li>
                  Para realizar compras você deve estar logado e ter items no
                  carrinho
                </li>
                <li>
                  Ao ser redirecionado para a página de checkout do stripe você
                  pode usar os dados a seguir para <strong>simular</strong> uma
                  compra:
                  <div className="flex flex-col rounded p-2 bg-light-gray-200 border-2 border-light-gray-300">
                    <span>Número do cartão: 4242 4242 4242 4242</span>{' '}
                    <span>
                      Data de expiração do cartão: deve ser uma data futura, por
                      exemplo 12/34
                    </span>{' '}
                    <span>CVC: quaisquer 3 dígitos</span>{' '}
                    <span>
                      Nome no cartão: qualquer nome, por exemplo apenas Fulano
                    </span>
                  </div>
                  Mais informações sobre testes usando cartões podem ser
                  encontradas em{' '}
                  <a
                    className={clsx(
                      'italic underline hover:opacity-80 rounded',
                      'transition-[outline] ease-in duration-150',
                      'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                    )}
                    href="https://stripe.com/docs/testing#use-test-cards"
                    target="_blank"
                    rel="noreferrer"
                  >
                    use-test-cards
                  </a>
                </li>
              </ul>
            </div>
          </main>
          <footer className="flex flex-col self-end justify-center p-4 gap-4">
            <div className="flex bg-light-orange-200/60 rounded p-2 border-2 border-light-orange-300">
              <Info
                className={clsx(
                  'md:flex',
                  'hidden flex-none w-6 h-6 text-light-gray-800 mr-2'
                )}
              />
              <span className="text-sm text-justify">
                O projeto possui limites em relação à exibição de mapas e
                operações de geolocalização. Com os limites ultrapassados você
                não conseguirá utilizar a aplicação em perfeito funcionamento.
                Espere alguns dias e tente novamente.
              </span>
            </div>

            <label className="flex items-center gap-4 ml-auto">
              Esconder botão de ajuda
              <Switch.Root
                defaultChecked={false}
                checked={isCompact}
                onCheckedChange={setIsCompact}
                className={clsx(
                  "w-14 h-8 bg-light-gray-200 relative rounded data-[state='checked']:bg-light-gray-300 transition-all duration-150 ease-in",
                  'transition-[background-color, outline] ease-in duration-150',
                  'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                )}
              >
                <Switch.Thumb className="block w-7 h-7 bg-light-gray-100 rounded shadow-md data-[state='checked']:translate-x-7 transition-all duration-150 ease-in"></Switch.Thumb>
              </Switch.Root>
            </label>
          </footer>
        </Content>
      </Portal>
    </Root>
  )
}
