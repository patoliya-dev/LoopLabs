"use client";

import { Link } from "react-router";
import { Button } from "../ui/button";

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <h1
                  className={`text-2xl font-caveat font-bold 'text-white-800' `}
                >
                  GenVox
                </h1>

                <p className={`text-sm text-white-600 font-caveat`}>
                  The voice of the new generation
                </p>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {/* Updated Link paths to match routes */}
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Button>
              <Link
                to="/chat"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
