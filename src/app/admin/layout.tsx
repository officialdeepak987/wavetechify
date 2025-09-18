
'use client';

import {
    Sidebar,
    SidebarProvider,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarTrigger,
    SidebarInset,
  } from '@/components/ui/sidebar'
import { Logo } from '@/components/logo'
import { LayoutDashboard, Newspaper, BriefcaseBusiness, Settings, LifeBuoy, Wrench, Users, Mail, LogOut, Quote, DollarSign, Share2 } from 'lucide-react'
import { logout } from './login/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.React.Node
}) {
    return (
        <div className="flex min-h-screen flex-col">
             <div className={'flex'}>
                <SidebarProvider>
                    <Sidebar>
                        <SidebarHeader>
                            <Logo />
                        </SidebarHeader>
                        <SidebarContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton href="/admin">
                                        <LayoutDashboard />
                                        Dashboard
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton href="/admin/inquiries">
                                        <Mail />
                                        Inquiries
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton href="/admin/pricing">
                                        <DollarSign />
                                        Pricing Plans
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton href="/admin/blog">
                                        <Newspaper />
                                        Blog Posts
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton href="/admin/services">
                                        <Wrench />
                                        Services
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton href="/admin/projects">
                                        <BriefcaseBusiness />
                                        Projects
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                 <SidebarMenuItem>
                                    <SidebarMenuButton href="/admin/tech-stack">
                                        <Share2 />
                                        Tech Stack
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton href="/admin/team">
                                        <Users />
                                        Team Members
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton href="/admin/testimonials">
                                        <Quote />
                                        Testimonials
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarContent>
                        <SidebarFooter>
                             <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="settings" className="border-0">
                                    <AccordionTrigger className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-ring transition-[width,height,padding] hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:font-medium data-[state=open]:text-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-8 text-sm hover:no-underline justify-start font-normal">
                                        <Settings />
                                        <span className="truncate">Settings</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-0">
                                        <SidebarMenu>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton href="/admin/settings">Site Info</SidebarMenuButton>
                                            </SidebarMenuItem>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton href="/admin/settings/homepage">Homepage Content</SidebarMenuButton>
                                            </SidebarMenuItem>
                                        </SidebarMenu>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton href="#">
                                        <LifeBuoy />
                                        Support
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                    <SidebarMenuItem>
                                    <form action={logout}>
                                        <SidebarMenuButton type="submit">
                                                <LogOut />
                                                Logout
                                        </SidebarMenuButton>
                                    </form>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>
                    </Sidebar>
                    <SidebarInset>
                        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                            <SidebarTrigger className="sm:hidden" />
                            <h1 className="text-xl font-semibold hidden sm:flex">Admin Dashboard</h1>
                            <p className="text-sm">Welcome, Admin</p>
                        </header>
                        <main className="p-4 sm:p-6">
                            {children}
                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </div>
    )
}
