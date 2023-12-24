import { FC } from 'react'

import type { User } from '@prisma/client'

import { DataTableEditUserPOS } from '@/components/shad/tables/tables-wrapper/data-table-edit-user-pos'

import {
  columnRemoveUserFromPOS,
  columnAddUserToPOS,
} from '@/components/shad/tables/columns'

import { columnAddNewUser } from '@/components/shad/tables/columns/add-new-user/columns-add-new-user'

import useSWRImmutable from 'swr/immutable'

import { ConnectOrDisconnect } from '@/constants/enums'
const { CONNECT, DISCONNECT } = ConnectOrDisconnect

import { SWR_KEYS } from '@/constants'

import { getUsers } from '@/services/fetchers-api'

interface EditUserOfPOSProps {
  mode: ConnectOrDisconnect
  usersOfThisPOS?: User[]

  POSId: number

  onClickActionTable?: (mode: ConnectOrDisconnect, user: User) => void
}

import { AccountType } from '@prisma/client'
const { Staff } = AccountType

const EditUserOfPOS: FC<EditUserOfPOSProps> = ({
  usersOfThisPOS,
  mode,
  POSId,
  onClickActionTable,
}) => {
  const {
    data: usersNotFromThisPOS,
    error,
    isLoading,
    isValidating,
  } = useSWRImmutable(
    mode === CONNECT ? SWR_KEYS.GET_USERS : null,
    () => getUsers([Staff], POSId),
    {
      revalidateOnMount: true,
    }
  )

  const handleConnectUserToPOS = (userToConnect: User) => {
    onClickActionTable && onClickActionTable(CONNECT, userToConnect)
  }

  const handleRemoveUserFromPOS = (userToRemove: User) => {
    onClickActionTable && onClickActionTable(DISCONNECT, userToRemove)
  }

  if (mode === CONNECT) {
    return (
      <DataTableEditUserPOS
        isLoading={isLoading || isValidating}
        columns={columnAddUserToPOS(handleConnectUserToPOS)}
        data={usersNotFromThisPOS?.result ?? []}
      />
    )
  }

  if (mode === DISCONNECT) {
    if (!usersOfThisPOS) {
      return <p>No user have been found for this POS</p>
    }

    return (
      <>
        {/* <ScrollArea className="h-[200px] w-full rounded-md border"> */}
        {/* <div className="p-2 flex flex-col gap-y-2 items-center"> */}
        <DataTableEditUserPOS
          columns={columnRemoveUserFromPOS(handleRemoveUserFromPOS)}
          data={usersOfThisPOS}
        />
        {/* </div> */}
        {/* </ScrollArea> */}
      </>
    )
  }
}

export default EditUserOfPOS
