import { PROMISE_TOAST_WAIT } from '@/constants'
import { toast } from 'react-toastify'

import { APIResponseBasic } from '@/types'

interface GetAsyncToastTypes {
  (asyncFx: () => Promise<APIResponseBasic<string>>): Promise<void>
}

export const getAsyncToast: GetAsyncToastTypes = async (asyncFx) => {
  await toast.promise(asyncFx, {
    pending: PROMISE_TOAST_WAIT,

    success: {
      render({ data }) {
        return `${data?.result} 👌`
      },
    },

    error: 'There has been an issue, try again later',
  })

  return
}
