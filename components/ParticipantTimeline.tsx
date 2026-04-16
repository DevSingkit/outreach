// components/ParticipantTimeline.tsx

interface TimelineStep {
  label: string;
  timestamp: string | null | undefined;
}

interface ParticipantTimelineProps {
  registeredAt: string | null;
  checkinTimestamp: string | null;
  procedureDone: boolean;
  paymentSettled: boolean;
  dischargeTimestamp: string | null;
}

function formatDate(ts: string | null | undefined): string {
  if (!ts) return '';
  return new Date(ts).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ParticipantTimeline({
  registeredAt,
  checkinTimestamp,
  procedureDone,
  paymentSettled,
  dischargeTimestamp,
}: ParticipantTimelineProps) {
  const steps: TimelineStep[] = [
    { label: 'Registered',       timestamp: registeredAt },
    { label: 'Checked In',       timestamp: checkinTimestamp },
    { label: 'Procedure Done',   timestamp: procedureDone ? 'done' : null },
    { label: 'Payment Settled',  timestamp: paymentSettled ? 'done' : null },
    { label: 'Discharged',       timestamp: dischargeTimestamp },
  ];

  return (
    <div className="flex items-start gap-0">
      {steps.map((step, idx) => {
        const completed = Boolean(step.timestamp);
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.label} className="flex flex-col items-center flex-1 min-w-0">
            {/* Circle + connector */}
            <div className="flex items-center w-full">
              {/* Left line */}
              {idx > 0 && (
                <div
                  className={`flex-1 h-0.5 ${completed ? 'bg-primary' : 'bg-muted/30'}`}
                />
              )}

              {/* Step circle */}
              <div
                className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  border-2 z-10
                  ${completed
                    ? 'bg-primary border-primary text-white'
                    : 'bg-surface border-muted/30 text-muted'
                  }
                `}
              >
                {completed ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <span className="text-xs font-semibold font-dm">{idx + 1}</span>
                )}
              </div>

              {/* Right line */}
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 ${
                    steps[idx + 1]?.timestamp ? 'bg-primary' : 'bg-muted/30'
                  }`}
                />
              )}
            </div>

            {/* Label + timestamp */}
            <div className="text-center mt-2 px-1">
              <p className={`text-xs font-dm font-semibold ${completed ? 'text-primary' : 'text-muted'}`}>
                {step.label}
              </p>
              {completed && step.timestamp !== 'done' && (
                <p className="text-[10px] text-muted font-dm mt-0.5">
                  {formatDate(step.timestamp)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}