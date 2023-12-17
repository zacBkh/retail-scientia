import { FC } from 'react'

import { ScrollArea } from '@/components/shad/ui/scroll-area'
import { Button } from '@/components/shad/ui/button'

import type { User } from '@prisma/client'

import { DataTable } from '@/components/shad/tables/data-table'

import {
  columnRemoveUserFromPOS,
  columnAddUserToPOS,
} from '@/components/shad/tables/columns'

import useSWRImmutable from 'swr/immutable'

import { AddOrRemove } from '@/constants/enums'
const { ADD_USER_TO_POS, REMOVE_USER_FROM_POS } = AddOrRemove

import { SWR_KEYS } from '@/constants'

import { getAllUsers } from '@/services/fetchers-api'

interface EditUserOfPOSProps {
  mode: AddOrRemove
  usersOfThisPOS?: User[]
}

const EditUserOfPOS: FC<EditUserOfPOSProps> = ({ usersOfThisPOS, mode }) => {
  const {
    data: allUsers,
    error,
    isLoading,
    isValidating,
  } = useSWRImmutable(
    mode === ADD_USER_TO_POS ? SWR_KEYS.GET_USERS : null,
    () => getAllUsers(),
    {
      revalidateOnMount: true,
    }
  )

  if (!usersOfThisPOS) {
    return <p>No user have been found for this POS</p>
  }

  if (mode === ADD_USER_TO_POS) {
    return (
      <DataTable
        isLoading={isLoading || isValidating}
        columns={columnAddUserToPOS}
        data={allUsers?.result ?? []}
      />
    )
  }

  if (mode === REMOVE_USER_FROM_POS) {
    return (
      <>
        {/* <ScrollArea className="h-[200px] w-full rounded-md border"> */}
        {/* <div className="p-2 flex flex-col gap-y-2 items-center"> */}
        <DataTable columns={columnRemoveUserFromPOS} data={usersOfThisPOS} />
        {/* </div> */}
        {/* </ScrollArea> */}
      </>
    )
  }
}

export default EditUserOfPOS
