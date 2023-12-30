import { FC, Dispatch, SetStateAction } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shad/ui/dialog'

import { Button } from '@/components/shad/ui/button'

interface AlertModalProps {
  trigger?: React.ReactNode
  title: string
  description: string
  handlerCancel: () => void
  handlerContinue: () => void

  isOpen: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

const DialogDeleteUser: FC<AlertModalProps> = ({
  trigger,
  title,
  description,
  handlerCancel,
  handlerContinue,
  isOpen,
  onOpenChange,
}) => {
  return (
    <>
      <Dialog onOpenChange={onOpenChange} open={isOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="mt-8">
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-x-2 justify-end">
              <Button size={'sm'} onClick={handlerCancel}>
                Cancel
              </Button>
              <Button
                size={'sm'}
                onClick={handlerContinue}
                variant="destructive"
              >
                Delete User
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DialogDeleteUser
