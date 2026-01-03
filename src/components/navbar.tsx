
"use client";

import Link from "next/link";
import { Truck, Menu, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
      await signOut()
      router.push('/')
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-[2000] transition-all">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 transition-opacity"
        >
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/track" className="hover:text-primary transition-colors">
            Track Shipment
          </Link>
          <Link
            href="/services"
            className="hover:text-primary transition-colors"
          >
            Services
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            About Us
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden lg:inline-flex text-sm font-medium">
                    Hello, {user.email?.split('@')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard')}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={handleLogout}>
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button asChild size="sm" className="hidden md:flex">
                <Link href="/book">Book Now</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex lg:hidden">
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex font-medium text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow hidden md:flex"
                asChild
              >
                <Link href="/book">Get Quote</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              <Link
                href="/track"
                className="block py-2 text-lg font-medium text-muted-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Track Shipment
              </Link>
              <Link
                href="/services"
                className="block py-2 text-lg font-medium text-muted-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/about"
                className="block py-2 text-lg font-medium text-muted-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <div className="pt-4 border-t space-y-3">
                {user ? (
                   <>
                    <Button
                      className="w-full justify-start mb-2"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/book">Book New Shipment</Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => { signOut(); setIsOpen(false); }}>
                      Logout
                    </Button>
                   </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      className="w-full justify-start"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/book">Get Quote</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
