import { FC } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shad/ui/dialog'

import { Button } from '@/components/shad/ui/button'

interface AlertModalProps {
  title: string
  description: string
  handlerContinue: () => void
  children?: React.ReactNode
}

const DialogDeleteUser: FC<AlertModalProps> = ({
  title,
  description,
  handlerContinue,
  children,
}) => {
  return (
    <>
      <Dialog>
        {children}
        <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="mt-8">
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-x-2 justify-end">
              <DialogClose asChild>
                <Button size="sm">Cancel</Button>
              </DialogClose>
              <Button size="sm" onClick={handlerContinue} variant="destructive">
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
