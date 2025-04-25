"use client";
import { SignInButton, UserButton, SignedOut, SignedIn } from "@clerk/nextjs";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
<<<<<<< HEAD
import { Menu, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
=======
import { Menu, X, Bot } from "lucide-react";
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd

function Header() {
  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
<<<<<<< HEAD
=======

>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
<<<<<<< HEAD
=======

>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
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
<<<<<<< HEAD
    document.body.style.overflow = !isMobileMenuOpen ? "hidden" : "unset";
=======
    
    // Prevent body scrolling when menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
<<<<<<< HEAD
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
=======
    document.body.style.overflow = 'unset';
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/about-us", label: "About us" },
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
  ];

  return (
    <>
      <header
        className={`
<<<<<<< HEAD
          fixed top-2 left-2 right-2 
          flex justify-between items-center 
          px-7 py-3 mx-[3rem]
          bg-white/90 backdrop-blur-md 
          rounded-full shadow-md z-50 
=======
          fixed top-0 left-0 right-0 
          flex justify-between items-center 
          p-4 sm:p-5 
          bg-white/90 backdrop-blur-md 
          shadow-md z-50 
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
          transition-all duration-300 ease-in-out
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
<<<<<<< HEAD
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
=======
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2"
          aria-label="Mock Interview Home"
          onClick={closeMobileMenu}
        >
          <Bot className="text-indigo-600" size={28} />
          <span className="text-xl sm:text-2xl font-bold text-primaryColor">Mock Interview Platform</span>
        </Link>

        {/* Desktop Navigation */}
        <nav 
          className="hidden md:flex gap-4 lg:gap-6"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              path={path}
              href={item.href}
              label={item.label}
              onClick={closeMobileMenu}
            />
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="focus:outline-none text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isMobileMenuOpen}
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

<<<<<<< HEAD
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
=======
        {/* Desktop Authentication */}
        <div className="hidden md:block">
          <SignedOut>
            <SignInButton mode="modal">
              <button 
                className="
                  px-4 py-2 
                  bg-indigo-600 text-white 
                  rounded-md 
                  hover:bg-indigo-700 
                  transition-colors
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-indigo-500 
                  focus:ring-offset-2
                "
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                },
              }} 
            />
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
          </SignedIn>
        </div>
      </header>

<<<<<<< HEAD
      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-0 bg-white z-40 md:hidden overflow-hidden pt-16"
=======
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="
            fixed inset-0 top-0 
            bg-white z-40 md:hidden 
            overflow-hidden
            pt-16
          "
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div className="h-full overflow-y-auto pb-16">
<<<<<<< HEAD
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
=======
            <nav className="space-y-6 p-6">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  path={path}
                  href={item.href}
                  label={item.label}
                  mobile
                  onClick={closeMobileMenu}
                />
              ))}

              {/* Mobile Authentication */}
              <div className="pt-6 border-t">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button 
                      className="
                        w-full px-4 py-2 
                        bg-indigo-600 text-white 
                        rounded-md 
                        hover:bg-indigo-700 
                        transition-colors
                        focus:outline-none 
                        focus:ring-2 
                        focus:ring-indigo-500 
                        focus:ring-offset-2
                      "
                      onClick={closeMobileMenu}
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
                    >
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center">
<<<<<<< HEAD
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: { userButtonAvatarBox: "w-12 h-12 mx-auto" },
                      }}
=======
                    <UserButton 
                      afterSignOutUrl="/" 
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-12 h-12 mx-auto",
                        },
                      }} 
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
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
<<<<<<< HEAD
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
=======
    <Link 
      href={href} 
      onClick={onClick}
      className={`
        block 
        transition-all duration-300 ease-in-out 
        cursor-pointer 
        rounded-lg 
        focus:outline-none 
        focus:ring-2 
        focus:ring-indigo-500
        ${mobile
          ? "w-full text-lg py-3 text-center"
          : "px-3 py-2 hover:bg-indigo-100 hover:text-indigo-600"
        }
        ${path === href
          ? "text-indigo-600 font-bold bg-indigo-100"
          : "text-gray-700 hover:text-indigo-600"
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
        }
      `}
    >
      {label}
    </Link>
  );
}

<<<<<<< HEAD
export default Header;
=======
export default Header;
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
