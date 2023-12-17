import { FC } from 'react'

import { ScrollArea } from '@/components/shad/ui/scroll-area'
import { Button } from '@/components/shad/ui/button'

import type { User } from '@prisma/client'

interface EditUserOfPOSProps {
  usersOfThisPOS?: User[]
}

const EditUserOfPOS: FC<EditUserOfPOSProps> = ({ usersOfThisPOS }) => {
  // fetch

  const handleClickOnUser = (user: User) => {
    console.log('you clicked on user', user)
  }
  return (
    <>
      <h6>User of this POS</h6>
      <ScrollArea className="h-[200px] w-1/3 rounded-md border">
        <div className="p-2 flex flex-col gap-y-2 items-center">
          {usersOfThisPOS?.map((user) => (
            <Button
              onClick={() => handleClickOnUser(user)}
              key={user.id}
              className="text-xs"
              size={'xs'}
            >
              {user.name}
            </Button>
          ))}

          {/* <Button className="text-xs" size={'xs'}>
            Mohamed
          </Button>
          <Button className="text-xs" size={'xs'}>
            Ruta
          </Button> */}
        </div>
      </ScrollArea>
    </>
  )
}

export default EditUserOfPOS
