import React from "react";
import Link from "next/link";
import { Button } from "./button";

export default function Header() {
  return (
    <header className="w-full bg-white border-b shadow-sm flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl tracking-tight">MyApp</span>
        <nav className="hidden md:flex gap-4">
          <Link href="/dashboard" className="text-gray-700 hover:text-black">Dashboard</Link>
          <a href="#" className="text-gray-700 hover:text-black">Reports</a>
          <a href="#" className="text-gray-700 hover:text-black">Settings</a>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">Log out</Button>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">U</div>
      </div>
    </header>
  );
} 
