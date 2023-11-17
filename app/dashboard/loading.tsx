import Spinner from '@/components/ui/spinner'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-[90vh]">
      <p className="text-xl font-semibold">Your Dashboard is loading... 💪🏼</p>
      <Spinner style="border-t-black !w-10 !h-10" />
    </div>
  )
}

export default Loading
