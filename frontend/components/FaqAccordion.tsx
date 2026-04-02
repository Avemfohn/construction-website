type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

export function FaqAccordion({
  items,
  className = "",
}: {
  items: FaqItem[];
  className?: string;
}) {
  return (
    <ul className={`divide-y divide-navy-800/80 border-t border-navy-800/80 ${className}`}>
      {items.map((item) => (
        <li key={item.id}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-medium text-anthracite-100 marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="pr-4 text-sm leading-snug sm:text-base">
                {item.question}
              </span>
              <span className="shrink-0 text-gold-500/80 transition group-open:rotate-180">
                <ChevronIcon className="h-5 w-5" />
              </span>
            </summary>
            <div className="pb-5 pl-0 pr-10 text-sm leading-relaxed text-anthracite-400">
              {item.answer}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
