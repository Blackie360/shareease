"use client"

import { Button } from "@/components/ui/button"

export function AddParticipantButton() {
  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Button
        className="rounded-full w-14 h-14 shadow-lg bg-brand-500 hover:bg-brand-600"
        onClick={() => {
          // This will trigger the addParticipant function in the CreateBillForm component
          // We're using a custom event to communicate with the form component
          document.dispatchEvent(new CustomEvent("add-participant"))
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="16" y1="11" x2="22" y2="11" />
        </svg>
      </Button>
    </div>
  )
}
