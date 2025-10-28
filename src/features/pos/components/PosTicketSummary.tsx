import type { PosTicketItem } from '../constants/mockData'

type PosTicketSummaryProps = {
  items: PosTicketItem[]
}

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'USD',
})

export const PosTicketSummary = ({ items }: PosTicketSummaryProps) => {
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <aside className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#2d2d2d]">Ticket Actual</h2>
        <span className="rounded-full bg-[#fdf0ed] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#b22222]">
          #{items.length.toString().padStart(3, '0')}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center text-[#9c9c9c]">
          <svg
            className="h-16 w-16 text-[#e9d9cc]"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8 12C8 10.3431 9.34315 9 11 9H37C38.6569 9 40 10.3431 40 12V39C40 40.6569 38.6569 42 37 42H11C9.34315 42 8 40.6569 8 39V12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 9V6C16 4.89543 16.8954 4 18 4H30C31.1046 4 32 4.89543 32 6V9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 21H34"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 29H27"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold">No hay productos agregados</p>
            <p className="text-sm">Agrega productos al ticket para comenzar</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between rounded-2xl border border-[#f3e3d4] bg-[#fef9f4] p-4"
            >
              <div>
                <p className="text-sm font-semibold text-[#2d2d2d]">{item.name}</p>
                <p className="text-xs text-[#8c8c8c]">
                  {item.quantity} {item.unit}
                </p>
              </div>
              <span className="text-sm font-semibold text-[#b22222]">
                {formatter.format(item.price)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm text-[#4a4a4a]">
          <span>Total</span>
          <span className="text-lg font-semibold text-[#b22222]">{formatter.format(total)}</span>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#b22222] py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#921c1c]"
        >
          Finalizar Venta
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-[#f7f0e6] py-3 text-sm font-semibold text-[#b22222] transition-colors duration-200 hover:border-[#b22222]/20"
        >
          Cancelar Venta
        </button>
      </div>
    </aside>
  )
}
