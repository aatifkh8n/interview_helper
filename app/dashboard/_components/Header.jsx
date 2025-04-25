"use client";
import { SignInButton, UserButton, SignedOut, SignedIn } from "@clerk/nextjs";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function Header() {
  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
    }
  }, [controlNavbar]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    document.body.style.overflow = !isMobileMenuOpen ? "hidden" : "unset";
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "unset";
  };

  const navItems = [
    { href: "/interview-copilot", label: "Interview Copilot" },
    { href: "/dashboard", label: "Mock AI Interview" },
    { href: "/how-it-works", label: "Pricing" },
    { href: "/about-us", label: "Contact us" },
    {
      label: "Resources",
      submenu: {
        More: [
          { href: "/testimonials", label: "Testimonials" },
          { href: "/about-us", label: "About us" },
          { href: "/blog", label: "Blog" },
          { href: "/guide", label: "Guide" },
        ],
        Support: [
          { href: "/faqs", label: "FAQs" },
          { href: "/how-it-works", label: "How it works" },
        ],
      },
    },
  ];

  return (
    <>
      <header
        className={`
          fixed top-2 left-2 right-2 
          flex justify-between items-center 
          px-7 py-3 mx-[3rem]
          bg-white/90 backdrop-blur-md 
          rounded-full shadow-md z-50 
          transition-all duration-300 ease-in-out
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Home"
          onClick={closeMobileMenu}
        >
          <img src="/images/logo.svg" alt="logo" />
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex gap-4 lg:gap-6"
          aria-label="Main Navigation"
        >
          {navItems.map((item, index) =>
            item.submenu ? (
              <div className="relative group" key={index}>
                <button className="px-3 py-2 text-gray-700 hover:text-primaryColor transition-colors">
                  {item.label} ▾
                </button>
                <div className="absolute right-0 text-right lg:left-0 lg:text-left top-full mt-2 w-[300px] bg-white rounded-lg shadow-lg p-6 grid grid-cols-2 gap-6 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 z-40">
                  {Object.entries(item.submenu).map(([category, links]) => (
                    <div key={category}>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">
                        {category}
                      </h4>
                      <ul className="space-y-1">
                        {links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="text-gray-700 hover:text-primaryColor"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <NavItem
                key={item.href}
                path={path}
                href={item.href}
                label={item.label}
                onClick={closeMobileMenu}
              />
            )
          )}
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="focus:outline-none text-gray-600 hover:text-primaryColor transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:block">
          <SignedOut>
            <div className="flex items-center gap-2 md:gap-3">
              <SignInButton mode="modal">Login</SignInButton>
              <button className="flex items-center gap-2 px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor-level1 transition-colors focus:outline-none">
                Free Trial <Play size={16} strokeWidth={4} />
              </button>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/dashboard">
                <button className="px-4 py-2 bg-primaryColor hover:bg-primaryColor-level1 text-white rounded-md text-sm md:text-base">
                  Dashboard
                </button>
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-12 h-12",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-0 bg-white z-40 md:hidden overflow-hidden pt-16"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div className="h-full overflow-y-auto pb-16">
            <nav className="space-y-6 p-6 text-center">
              {navItems.map((item, index) =>
                item.submenu ? (
                  <div className="pt-4 border-t" key={index}>
                    <h4 className="font-semibold text-gray-600 mb-2">
                      {item.label}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(item.submenu).map(([category, links]) => (
                        <div key={category}>
                          <h5 className="font-semibold text-sm text-gray-500 mb-1">
                            {category}
                          </h5>
                          <ul className="space-y-1">
                            {links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  onClick={closeMobileMenu}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavItem
                    key={item.href}
                    path={path}
                    href={item.href}
                    label={item.label}
                    mobile
                    onClick={closeMobileMenu}
                  />
                )
              )}

              {/* Mobile Auth */}
              <div className="pt-6 border-t">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button
                      onClick={closeMobileMenu}
                      className="w-full px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: { userButtonAvatarBox: "w-12 h-12 mx-auto" },
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function NavItem({ path, href, label, mobile, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        block transition-all duration-300 ease-in-out cursor-pointer rounded-lg
        ${
          mobile
            ? "w-full text-lg py-3 text-center"
            : "px-3 py-2 hover:text-primaryColor"
        }
        ${
          path === href
            ? "text-primaryColor"
            : "text-gray-700 hover:text-primaryColor"
        }
      `}
    >
      {label}
    </Link>
  );
}

export default Header;
