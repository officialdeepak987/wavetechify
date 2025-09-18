
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "./logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getServices } from "@/app/admin/services/_actions/service-actions";
import type { Service } from "@/lib/types";

const baseNavItems = [
  { label: "Home", href: "/" },
  { 
    label: "Company", 
    href: "/about",
    submenu: [
      { label: "About Us", href: "/about" },
      { label: "Pricing", href: "/pricing" },
    ]
  },
  { 
    label: "Services", 
    href: "/services",
    submenu: [] // This will be populated dynamically
  },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState(baseNavItems);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    async function fetchServicesForNav() {
      try {
        const services = await getServices();
        const serviceSubmenu = services.map(s => ({label: s.title, href: `/services/${s.slug}`}));
        setNavItems(prevItems => prevItems.map(item => 
          item.label === "Services" ? { ...item, submenu: serviceSubmenu } : item
        ));
      } catch (error) {
        console.error("Failed to fetch services for navigation:", error);
      }
    }
    fetchServicesForNav();
  }, []);

  const isLinkActive = (href: string) => {
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 text-sm font-medium md:flex">
            {navItems.map((item) => (
              item.submenu && item.submenu.length > 0 ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center gap-1 transition-colors hover:text-primary",
                        pathname.startsWith(item.href) ? "text-primary" : "text-foreground/80"
                      )}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {isMounted && item.submenu.map(subItem => (
                       <DropdownMenuItem key={subItem.href} asChild>
                        <Link href={subItem.href}>{subItem.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button key={item.href} asChild variant="ghost">
                    <Link
                        href={item.href}
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname === item.href ? "text-primary font-bold" : "text-foreground/80"
                        )}
                        >
                        {item.label}
                    </Link>
                </Button>
              )
            ))}
          </nav>
          <div className="hidden items-center gap-4 md:flex">
             <Button asChild>
                <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>
          
          {/* Mobile Navigation */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                    <Logo />
                </SheetHeader>
              <div className="flex flex-col gap-2 mt-4">
                <Accordion type="single" collapsible className="w-full">
                  {navItems.map((item) => (
                    item.submenu && item.submenu.length > 0 ? (
                      <AccordionItem value={item.label} key={item.label} className="border-b">
                        <AccordionTrigger className="py-3 px-4 text-base font-semibold hover:no-underline">
                            {item.label}
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="flex flex-col gap-1 pl-8 pr-4 py-2 border-l ml-4">
                            {isMounted && item.submenu.map((subItem) => (
                                <SheetClose key={subItem.href} asChild>
                                    <Link
                                        href={subItem.href}
                                        className={cn(
                                            "block py-2 text-base",
                                            isLinkActive(subItem.href) ? "text-primary font-semibold" : "text-foreground/80"
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                </SheetClose>
                            ))}
                           </div>
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          className={cn(
                              "block px-4 py-3 text-base font-semibold border-b",
                              isLinkActive(item.href) ? "text-primary" : "text-foreground"
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    )
                  ))}
                </Accordion>
                <div className="p-4 mt-4">
                    <SheetClose asChild>
                        <Button asChild className="w-full">
                            <Link href="/contact">Get a Quote</Link>
                        </Button>
                    </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
