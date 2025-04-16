/* eslint-disable @typescript-eslint/naming-convention */
"use client";

import React from "react"; // <-- This brings in JSX.Element
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

/**
 * Displays cookie consent banner at bottom of page.
 * Handles accept/reject actions and saves user's choice to localStorage.
 * @returns {React.ReactElement | null} The cookie banner UI element, or null if already accepted/rejected.
 */
export default function CookieBanner(): React.ReactElement | null {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  // Slight delay before showing banner of consent hasn't been given yet
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setTimeout(() => {
        setShouldRender(true);
        setTimeout(() => setShowBanner(true), 50);
      }, 1500);
    }
  }, []);

  // Handle user's choice by storing locally
  const handleConsent = (accepted: boolean): void => {
    setShowBanner(false);
    setTimeout(() => setShouldRender(false), 300);
    localStorage.setItem("cookieConsent", accepted ? "true" : "false");
  };

  // Don't render banner if user already accepted or rejected
  if (!shouldRender) return null;

  return (
    <div className={
      cn("fixed bottom-0 left-0 w-full bg-accent/80 p-4 text-center z-10 transition duration-500 ease-out",
        showBanner ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        "space-y-4"
      )}>
      <p>
        We use cookies to improve your experience. Read our{" "}
        <Link href="/privacy-policy" className="underline text-primary hover:text-primary/70">
          privacy policy
        </Link>
      </p>
      <div className="flex justify-center gap-4">
        <Button className="hover:cursor-pointer" onClick={() => handleConsent(true)}>Accept</Button>
        <Button className="hover:cursor-pointer" variant="destructive" onClick={() => handleConsent(false)}>Reject</Button>
      </div>
    </div>
  );
}