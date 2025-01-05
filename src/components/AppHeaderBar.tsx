import { type GraphFilter } from 'dsssp'

const AppHeaderBar = ({
  onPresetChange
}: {
  onPresetChange: (filters: GraphFilter[]) => void
}) => {
  return (
    <div className="flex flex-row w-full gap-2 p-2  bg-black border border-zinc-800 rounded-sm shadow-sm items-center justify-between">
      <h1 className="px-2 text-2xl font-mono ">DSSSP DEMO</h1>
      <div className="flex flex-row border rounded-sm border-zinc-800 relative">
        <div className="text-zinc-500 text-center w-[180px] py-1 ">
          Custom Preset
        </div>
        <button
          className="px-3 py-1 m-[-1px] text-sm font-semibold text-zinc-500 bg-black border border-zinc-800 rounded-sm hover:bg-zinc-950 hover:text-zinc-300 focus-visible:z-10 focus:outline-none  focus-visible:border-sky-500 active:border-zinc-300 active:z-10"
          onClick={() => onPresetChange([])}
        >
          &#129120;
        </button>
        <button
          className="px-3 py-1 m-[-1px] text-sm font-semibold text-zinc-500 bg-black border border-zinc-800 rounded-sm hover:bg-zinc-950 hover:text-zinc-300 focus-visible:z-10 focus:outline-none  focus-visible:border-sky-500 active:border-zinc-300 active:z-10"
          onClick={() => onPresetChange([])}
        >
          &#129122;
        </button>
      </div>
    </div>
  )
}

export default AppHeaderBar
