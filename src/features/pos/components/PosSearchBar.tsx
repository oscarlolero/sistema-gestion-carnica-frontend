type PosSearchBarProps = {
  value: string
  onChange: (value: string) => void
}

export const PosSearchBar = ({ value, onChange }: PosSearchBarProps) => {
  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Buscar productos..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-transparent bg-[#f7f0e6] px-12 py-3 text-sm text-[#4a4a4a] shadow-inner placeholder:text-[#b8a898] focus:border-[#d7c1ac] focus:outline-none focus:ring-2 focus:ring-[#e6d3c1]"
      />
      <svg
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b8a898]"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 21L16.65 16.65"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
