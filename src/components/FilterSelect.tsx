import {
  FilterIcon,
  filterTypeKeys,
  type FilterType,
  type GraphFilter
} from 'dsssp'

import 'dsssp/font'

const FilterSelect = ({
  color,
  filter,
  onChange
}: {
  color?: string
  filter: GraphFilter
  onChange: (type: FilterType) => void
}) => {
  return (
    <div>
      <div className="font-semibold text-sm text-zinc-500 z-10 relative">
        Type
      </div>

      <div className="relative py-1 text-zinc-500 hover:text-zinc-300 ">
        <select
          value={filter.type}
          onChange={(e) => onChange(e.target.value as FilterType)}
          className="bg-transparent text-transparent appearance-none w-full h-full px-1 cursor-pointer focus:outline-none focus:ring-0"
        >
          {filterTypeKeys.map((type: string) => (
            <option
              key={type}
              value={type}
              className="bg-zinc-950 text-center text-sm text-white"
            >
              {type}
            </option>
          ))}
        </select>
        <div className="absolute top-1/2 right-1 transform -translate-y-1/2 pointer-events-none z-10">
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div className="p-1 absolute -top-1 left-1/2 -translate-x-1/2 pointer-events-none">
          <FilterIcon
            size={36}
            color={color}
            filter={filter}
            className="relative z-10"
            style={{ textShadow: `${color}80 0 0 8px` }}
          />
          <div
            className="absolute rounded-full -inset-8"
            style={{
              background: `radial-gradient(circle, ${color}20 0%, ${color}08 15%, transparent 70%)`
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default FilterSelect
