// components/DischargeBlocker.tsx

const messages: Record<string, string> = {
  NO_PETS_REGISTERED:    'No pets are registered for this visit.',
  PROCEDURES_INCOMPLETE: 'Not all procedures have been completed or resolved.',
  PAYMENT_NOT_SETTLED:   'Payment has not been settled.',
};

interface DischargeBlockerProps {
  blockerCode: string;
}

export function DischargeBlocker({ blockerCode }: DischargeBlockerProps) {
  return (
    <div className="flex items-start gap-3 bg-red-50 border-l-4 border-error rounded-card p-4">
      <svg
        className="flex-shrink-0 w-5 h-5 text-error mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <div>
        <p className="text-sm font-semibold font-dm text-error">Cannot discharge</p>
        <p className="text-sm font-dm text-error/80 mt-0.5">
          {messages[blockerCode] ?? 'Unknown error. Please contact support.'}
        </p>
      </div>
    </div>
  );
}