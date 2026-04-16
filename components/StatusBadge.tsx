// components/StatusBadge.tsx

const badgeMap: Record<string, string> = {
  Pending:     'badge-pending',
  'Checked-in':'badge-checked-in',
  'No-show':   'badge-no-show',
  Accepted:    'badge-accepted',
  Rejected:    'badge-rejected',
  Completed:   'badge-completed',
  Paid:        'badge-paid',
  Waived:      'badge-waived',
  Unpaid:      'badge-unpaid',
  Draft:       'badge-draft',
  Open:        'badge-open',
  Ongoing:     'badge-ongoing',
  Closed:      'badge-closed',
};

export function StatusBadge({ status }: { status: string }) {
  const cls = badgeMap[status] ?? 'badge-pending';
  return (
    <span
      className={`${cls} inline-flex items-center text-xs font-semibold font-dm px-3 py-1 rounded-full whitespace-nowrap`}
    >
      {status}
    </span>
  );
}