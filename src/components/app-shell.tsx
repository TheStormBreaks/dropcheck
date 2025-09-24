'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileText, Bot, PlusCircle, LogOut, User as UserIcon, Moon, Sun, Monitor } from 'lucide-react';
import { Logo } from '@/components/logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Separator } from './ui/separator';
import { useTheme } from '@/hooks/use-theme';

type AppShellProps = {
  children: React.ReactNode;
  title: string;
};

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/recommendations', icon: Bot, label: 'AI Health Guide' },
];

export function AppShell({ children, title }: AppShellProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-white" />
            <span className="text-xl font-bold font-headline text-sidebar-foreground">DropCheck</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <Separator className="my-2" />
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Start New Test">
                  <Link href="/connect-device">
                    <PlusCircle />
                    <span>New Test</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="font-headline text-xl font-semibold sm:text-2xl">{title}</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {theme === 'light' && <Sun className="mr-2" />}
                  {theme === 'dark' && <Moon className="mr-2" />}
                  {theme === 'system' && <Monitor className="mr-2" />}
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    <Sun className="mr-2" /> Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <Moon className="mr-2" /> Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    <Monitor className="mr-2" /> System
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
