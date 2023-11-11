import { FC } from 'react'

import { Button, Flex, AlertDialog } from '@radix-ui/themes'

import Baaaaa from '../button-validate-cart'

interface AlertDialogRxProps {
  buttonTriggerTxt: string
  headerTxt: string
  bodyTxt: string
  bodyTxt2?: string
  btnConfirmTxt: string
  btnCancelTxt?: string

  onValidateAction: () => void
}

const AlertDialogRx: FC<AlertDialogRxProps> = ({
  buttonTriggerTxt,
  headerTxt,
  bodyTxt,
  btnConfirmTxt,
  btnCancelTxt,
  bodyTxt2,

  onValidateAction,
}) => {
  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button>{buttonTriggerTxt}</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>{headerTxt}</AlertDialog.Title>
          <div className="flex flex-col gap-y-2">
            <AlertDialog.Description size="2">
              {bodyTxt}
            </AlertDialog.Description>
            {bodyTxt2 ? (
              <AlertDialog.Description size="2">
                {bodyTxt2}
              </AlertDialog.Description>
            ) : (
              ''
            )}
          </div>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                {btnCancelTxt ?? 'Cancel'}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button onClick={onValidateAction} variant="solid" color="red">
                {btnConfirmTxt ?? 'Continue'}
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}

export default AlertDialogRx
