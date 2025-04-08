"use client";
import React from "react";

export default function AboutUsPage() {
  return (
    <div
      style={{
        padding: "2rem",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h1>About Us</h1>
      <p>
        Welcome to Match4Good! We are dedicated to connecting people with
        meaningful volunteering opportunities.
      </p>

      <h2>Our Mission</h2>
      <p>
        Our mission is to make volunteering more accessible and impactful by
        bridging the gap between volunteers and organizations in need.
      </p>

      <h2>Get Involved</h2>
      <p>
        Whether you’re an individual looking to volunteer or an organization
        seeking volunteers, we are here to help!
      </p>

      <h2>Contact Us</h2>
      <p>If you have any questions, reach out at support@match4good.com.</p>
    </div>
  );
}
