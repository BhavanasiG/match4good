/* eslint-disable @typescript-eslint/naming-convention */
"use client";

import React from "react"; // <-- This brings in JSX.Element
import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#333",
        color: "white",
        padding: "1rem",
        textAlign: "center",
        zIndex: 1000,
        transition: "opacity 0.8s ease, transform 0.8s ease",
        opacity: showBanner ? 1 : 0,
        transform: showBanner ? "translateY(0%)" : "translateY(100%)",
      }}
    >
      <p style={{ marginBottom: "0.5rem" }}>
        We use cookies to improve your experience. Read our{" "}
        <Link
          href="/privacy-policy"
          style={{ textDecoration: "underline", color: "#90cdf4" }}
        >
          privacy policy
        </Link>
        .
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          onClick={() => handleConsent(true)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Accept
        </button>
        <button
          onClick={() => handleConsent(false)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
