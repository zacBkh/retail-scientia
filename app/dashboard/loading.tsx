import Spinner from '@/components/ui/spinner'

const Loading = () => {
  return (
    <div className="flex flex-col items-center gap-4 h-screen sm:h-[40vw]">
      <p className="text-xl font-semibold">Your Dashboard is loading...</p>
      <Spinner style="border-t-black !w-10 !h-10" />
    </div>
  )
}

export default Loading
