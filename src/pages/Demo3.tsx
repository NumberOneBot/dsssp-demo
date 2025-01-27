import NavBar from './components/NavBar'

const Demo3 = () => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="w-[600px] flex flex-col gap-4">
        <NavBar />
        <h1 className="text-2xl font-bold mt">Demo 3</h1>
      </div>
    </div>
  )
}

export default Demo3
