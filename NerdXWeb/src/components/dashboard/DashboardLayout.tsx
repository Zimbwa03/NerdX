import type { ReactNode } from 'react';

export interface DashboardLayoutProps {
  topbar: ReactNode;
  sidebar: ReactNode;
  rightPanel: ReactNode;
  children: ReactNode;
  mobileNavOpen: boolean;
  onMobileNavClose: () => void;
}

export function DashboardLayout({
  topbar,
  sidebar,
  rightPanel,
  children,
  mobileNavOpen,
  onMobileNavClose,
}: DashboardLayoutProps) {
  return (
    <div className="dashboard-premium-shell flex min-h-screen flex-col bg-[var(--bg-base)] font-dm text-[15px] text-[var(--text-primary)] antialiased selection:bg-emerald-500/30">
      {topbar}

      <div className="relative flex min-h-0 flex-1">
        {mobileNavOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            aria-label="Close navigation menu"
            onClick={onMobileNavClose}
          />
        ) : null}

        <div
          className={`fixed bottom-0 left-0 top-16 z-50 w-[240px] transition-transform duration-200 ease-out lg:static lg:top-auto lg:z-auto lg:h-auto lg:translate-x-0 ${
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } `}
        >
          {sidebar}
        </div>

        <main
          id="dashboard-main-scroll"
          className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--bg-base)] px-5 py-8 md:px-6 md:py-10 lg:px-8"
          tabIndex={-1}
        >
          <div className="mx-auto w-full max-w-[900px]">{children}</div>
        </main>

        {rightPanel}
      </div>
    </div>
  );
}
