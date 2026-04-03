import {ChevronRight} from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({items}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-art-clay">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <a href={item.href} className="hover:text-art-terracotta">
                  {item.label}
                </a>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
              {!isLast ? <ChevronRight className="h-3.5 w-3.5" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
