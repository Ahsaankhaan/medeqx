import { cn } from '@/lib/utils';

type BadgeVariant = 'new' | 'refurbished' | 'used' | 'parts' | 'for_sale' | 'wanted' |
  'pending' | 'approved' | 'suspended' | 'sold';

const variants: Record<BadgeVariant, { label: string; className: string; dot?: string }> = {
  new:         { label: 'New',         className: 'bg-emerald-50  text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
  refurbished: { label: 'Refurbished', className: 'bg-blue-50     text-blue-700    border border-blue-200',    dot: 'bg-blue-500'    },
  used:        { label: 'Used',        className: 'bg-amber-50    text-amber-700   border border-amber-200',   dot: 'bg-amber-500'   },
  parts:       { label: 'For Parts',   className: 'bg-red-50      text-red-700     border border-red-200',     dot: 'bg-red-500'     },
  for_sale:    { label: 'For Sale',    className: 'bg-indigo-50   text-indigo-700  border border-indigo-200'                          },
  wanted:      { label: 'Wanted',      className: 'bg-purple-50   text-purple-700  border border-purple-200'                         },
  pending:     { label: 'Pending',     className: 'bg-amber-50    text-amber-700   border border-amber-200'                          },
  approved:    { label: 'Live',        className: 'bg-emerald-50  text-emerald-700 border border-emerald-200'                        },
  suspended:   { label: 'Suspended',   className: 'bg-red-50      text-red-700     border border-red-200'                            },
  sold:        { label: 'Sold',        className: 'bg-slate-100   text-slate-600   border border-slate-200'                         },
};

export function Badge({ variant, label, className }: { variant: BadgeVariant; label?: string; className?: string }) {
  const v = variants[variant];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', v.className, className)}>
      {v.dot && <span className={cn('h-1.5 w-1.5 rounded-full', v.dot)} />}
      {label ?? v.label}
    </span>
  );
}
