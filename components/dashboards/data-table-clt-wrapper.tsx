'use client'

import { FC } from 'react'

import type { UserWithoutPwd } from '@/types'

interface propsType {
  data: UserWithoutPwd[]
}

import { DataTableAddNewUser } from '@/components/shad/tables/tables-wrapper/data-table-add-new-user'
import { columnAddNewUser } from '@/components/shad/tables/columns/add-new-user/columns-add-new-user'

const DataTableCltWrapper: FC<propsType> = ({ data }) => {
  const onDeleteUserRequest = (userID: number) => {
    console.log('delete user request', userID)
  }
  const onEditUserRequest = (userID: number) => {
    console.log('edit user request', userID)
  }

  return (
    <>
      <DataTableAddNewUser
        columns={columnAddNewUser(onDeleteUserRequest, onEditUserRequest)}
        data={data ?? []}
      />
    </>
  )
}

export default DataTableCltWrapper
