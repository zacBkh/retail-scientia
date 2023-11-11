import { FC } from 'react'

import { Button, Flex, AlertDialog } from '@radix-ui/themes'

interface AlertDialogRxProps {
  buttonTriggerTxt: string
  headerTxt: string
  bodyTxt: string
  btnConfirmTxt: string
  btnCancelTxt?: string
}

const AlertDialogRx: FC<AlertDialogRxProps> = ({
  buttonTriggerTxt,
  headerTxt,
  bodyTxt,
  btnConfirmTxt,
  btnCancelTxt,
}) => {
  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button>{buttonTriggerTxt}</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>{headerTxt}</AlertDialog.Title>
          <AlertDialog.Description size="2">{bodyTxt}</AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                {btnCancelTxt ?? 'Cancel'}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red">
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
