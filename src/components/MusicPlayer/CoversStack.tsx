import clsx from 'clsx'

export const CoversStack = ({
  covers,
  active,
  onClick
}: {
  covers: string[]
  active: number
  onClick: (index: number) => void
}) => {
  const rotatedCovers = [...covers.slice(active), ...covers.slice(0, active)]
    .map((cover, i) => ({
      cover,
      index: (i + active) % covers.length
    }))
    .reverse()

  return (
    <div className="h-[34px] w-[34px] relative overflow-visible">
      {rotatedCovers.map(({ cover, index }, layerIndex) => {
        const layer = covers.length - layerIndex - 1
        return (
          <img
            key={index}
            src={cover}
            alt="cover"
            className={clsx(
              'bg-black cursor-pointer w-full h-full absolute transform-gpu origin-left'
            )}
            style={{
              width: 34 - layer * 6,
              height: 34 - layer * 6,
              left: layer * -5,
              top: layer * 3,
              filter: `brightness(${100 - layer * 25}%)`
            }}
            onClick={() => (layer === 0 ? onClick(index) : null)}
          />
        )
      })}
    </div>
  )
}
