import type {ReactNode} from 'react';

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({children}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-art-beige/60 px-6 py-10">
      <div className="mx-auto max-w-6xl rounded-gentle border border-border bg-art-cream p-8 shadow-card">
        {children}
      </div>
    </div>
  );
}
