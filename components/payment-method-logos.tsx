"use client"

export function PaymentMethodLogos() {
  return (
    <div className="mb-6 flex flex-wrap gap-4 justify-center">
      <div className="text-center">
        <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-1">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#4CAF50">
            <path d="M16.2 11.7c-.1-.2-.3-.4-.5-.5-.2-.1-.5-.2-.8-.2s-.6.1-.8.2c-.2.1-.4.3-.5.5-.1.2-.2.5-.2.8s.1.6.2.8c.1.2.3.4.5.5.2.1.5.2.8.2s.6-.1.8-.2c.2-.1.4-.3.5-.5.1-.2.2-.5.2-.8s-.1-.6-.2-.8zM17.8 7.7c.1.2.2.5.2.8s-.1.6-.2.8c-.1.2-.3.4-.5.5-.2.1-.5.2-.8.2s-.6-.1-.8-.2c-.2-.1-.4-.3-.5-.5-.1-.2-.2-.5-.2-.8s.1-.6.2-.8c.1-.2.3-.4.5-.5.2-.1.5-.2.8-.2s.6.1.8.2c.2.1.4.3.5.5z" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5.8 15.8c-.4.4-.9.7-1.5.9-.6.2-1.3.3-2 .3-.7 0-1.4-.1-2-.3-.6-.2-1.1-.5-1.5-.9-.4-.4-.7-.9-.9-1.5-.2-.6-.3-1.3-.3-2 0-.7.1-1.4.3-2 .2-.6.5-1.1.9-1.5.4-.4.9-.7 1.5-.9.6-.2 1.3-.3 2-.3.7 0 1.4.1 2 .3.6.2 1.1.5 1.5.9.4.4.7.9.9 1.5.2.6.3 1.3.3 2 0 .7-.1 1.4-.3 2-.2.6-.5 1.1-.9 1.5z" />
          </svg>
        </div>
        <span className="text-xs">M-Pesa</span>
      </div>
      <div className="text-center">
        <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-1">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#FF5722">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
          </svg>
        </div>
        <span className="text-xs">Airtel Money</span>
      </div>
      <div className="text-center">
        <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-1">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#2196F3">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
          </svg>
        </div>
        <span className="text-xs">Card</span>
      </div>
      <div className="text-center">
        <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-1">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#FFC107">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
          </svg>
        </div>
        <span className="text-xs">Cash</span>
      </div>
      <div className="text-center">
        <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-1">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#9C27B0">
            <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z" />
          </svg>
        </div>
        <span className="text-xs">Bank Transfer</span>
      </div>
    </div>
  )
}
