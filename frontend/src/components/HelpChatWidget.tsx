"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export function HelpChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Auto close after 3s on success
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 3000);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={widgetRef}>
      {/* The Chat Window */}
      <div 
        className={`mb-4 w-[340px] origin-bottom-right transition-all duration-300 ease-out sm:w-[380px] ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0e0e10]/80 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-5 py-4">
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-[#f5f5f7]">Technical Support</span>
              <span className="text-[13px] text-white/50">Send a request to our team</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            {isSuccess ? (
              <div className="flex min-h-[160px] flex-col items-center justify-center space-y-3 py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-white">Message sent</h4>
                  <p className="mt-1 text-[14px] text-white/50">We'll get back to you shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4" autoComplete="off">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[13px] font-medium text-white/70">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white placeholder:text-white/30 focus:border-[rgba(10,132,255,0.8)] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[rgba(10,132,255,0.8)] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-[13px] font-medium text-white/70">
                    How can we help?
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Describe your issue or question..."
                    className="w-full resize-none rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white placeholder:text-white/30 focus:border-[rgba(10,132,255,0.8)] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[rgba(10,132,255,0.8)] transition-all text-left"
                  ></textarea>
                </div>
                <Button intent="primary" type="submit" className="mt-2 w-full justify-center opacity-100 disabled:opacity-70" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                       <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : "Send Request"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-white/[0.09] bg-white/[0.06] px-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:bg-white/[0.1] active:scale-95"
        aria-label="Help"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a84ff]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Label and Icon Container */}
        <div className="relative flex items-center justify-center space-x-2 text-white font-medium">
          <span className="text-[15px] mr-1">{isOpen ? "Close" : "Help"}</span>
          
          <div className="relative flex h-5 w-5 items-center justify-center">
            {/* Open Icon (Message) */}
            <svg 
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
              className={`absolute transition-all duration-300 ${isOpen ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
            >
              <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3l-3 3z"/>
            </svg>
            
            {/* Close Icon (X) */}
            <svg 
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
              className={`absolute transition-all duration-300 ${isOpen ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`}
            >
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}
