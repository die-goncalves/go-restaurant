'use client'

import { Portal } from '@zag-js/react'
import * as tour from '@zag-js/tour'
import { CloseIcon } from '@/src/components/icons/close'
import { Button } from '@/src/components/ui/button'
import { Tour as TourPrimitive } from '@/src/components/ui/tour'
import { useTour } from '@/src/components/ui/tour/use-tour'
import { css } from '@/styled-system/css'
import { TourIcon } from '@/src/components/icons/tour'

const steps: tour.StepDetails[] = [
  {
    id: 'step-1',
    type: 'dialog',
    title: 'Bem-vindo ao tour!',
    description:
      'Vamos fazer um breve tour para você descobrir onde nos encontrar e como testar nosso projeto.',
    actions: [{ label: 'Iniciar visita guiada', action: 'next' }]
  },
  {
    id: 'step-2',
    type: 'tooltip',
    title: 'Central de ajuda',
    description:
      'Aqui você encontra formas de testar nosso projeto na prática.',
    target: () => document.querySelector<HTMLElement>('#help'),
    actions: [
      { label: 'Voltar', action: 'prev' },
      { label: 'Avançar', action: 'next' }
    ],
    placement: 'top-start',
    gutter: 16,
    overflowPadding: 16
  },
  {
    id: 'step-3',
    type: 'tooltip',
    title: 'Sobre o projeto',
    description: 'Aqui você pode saber mais sobre o projeto.',
    target: () => document.querySelector<HTMLElement>('#welcome'),
    actions: [
      { label: 'Voltar', action: 'prev' },
      { label: 'Avançar', action: 'next' }
    ],
    placement: 'bottom-start',
    gutter: 16,
    overflowPadding: 16
  },
  {
    id: 'step-4',
    type: 'dialog',
    title: 'Tudo pronto!',
    description:
      'Você já conhece o essencial. Agora é só explorar — e se precisar de ajuda, o tour estará sempre disponível.',
    actions: [{ label: 'Fim', action: 'dismiss' }]
  }
]

export function Tour() {
  const api = useTour({
    steps,
    keyboardNavigation: true,
    closeOnInteractOutside: false,
    spotlightRadius: 0,
    spotlightOffset: { x: 4, y: 4 },
    translations: {
      progressText: ({ current, total }) => `Passo ${current + 1} de ${total}`,
      close: 'Fechar tour',
      nextStep: 'Próximo passo',
      prevStep: 'Passo anterior'
    }
  })

  return (
    <div>
      <TourPrimitive.RootProvider {...api}>
        <TourPrimitive.Trigger asChild>
          <Button
            id="tour-step-0"
            variant="solid"
            iconPlacement="left"
            icon={<TourIcon />}
          >
            Tour
          </Button>
        </TourPrimitive.Trigger>

        <Portal>
          <TourPrimitive.Backdrop />
          <TourPrimitive.Spotlight />

          <TourPrimitive.Positioner>
            <TourPrimitive.Content>
              <>
                <TourPrimitive.Arrow>
                  <TourPrimitive.ArrowTip />
                </TourPrimitive.Arrow>
                <div
                  className={css({
                    display: 'flex',
                    paddingBlockStart: { base: '4', medium: '6' },
                    paddingBlockEnd: '4',
                    paddingInline: { base: '4', medium: '6' },
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  })}
                >
                  <TourPrimitive.ProgressText />
                  <TourPrimitive.CloseTrigger asChild>
                    <Button className={css({ padding: 0 })}>
                      <CloseIcon />
                    </Button>
                  </TourPrimitive.CloseTrigger>
                </div>
                <div
                  className={css({
                    paddingBlockEnd: '4',
                    paddingInline: { base: '4', medium: '6' },
                    alignItems: 'center'
                  })}
                >
                  <TourPrimitive.Title as="h2" />
                </div>
                <div
                  className={css({
                    paddingInline: { base: '4', medium: '6' }
                  })}
                >
                  <TourPrimitive.Description />
                </div>
                <div
                  className={css({
                    paddingBlockStart: '4',
                    paddingBlockEnd: { base: '4', medium: '6' },
                    paddingInline: { base: '4', medium: '6' },
                    flexDirection: { base: 'column', medium: 'row' }
                  })}
                >
                  <TourPrimitive.Actions
                    className={css({ display: 'flex', gap: '4' })}
                  >
                    {({ actions }) => {
                      return actions?.map(action => (
                        <TourPrimitive.ActionTrigger
                          key={action.label}
                          asChild
                          action={action}
                        >
                          <Button
                            variant={
                              action.action === 'prev' ? 'ghost' : 'solid'
                            }
                          >
                            {action.label}
                          </Button>
                        </TourPrimitive.ActionTrigger>
                      ))
                    }}
                  </TourPrimitive.Actions>
                </div>
                <TourPrimitive.ProgressBar />
              </>
            </TourPrimitive.Content>
          </TourPrimitive.Positioner>
        </Portal>
      </TourPrimitive.RootProvider>
    </div>
  )
}
