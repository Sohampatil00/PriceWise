import { SidebarTrigger } from '@/components/ui/sidebar';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="flex-1 font-headline text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <div className="flex items-center gap-4">
        {children}
      </div>
    </header>
  );
}
