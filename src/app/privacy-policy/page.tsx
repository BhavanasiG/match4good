'use client';
import React from 'react';

const sections = [
  {
    icon: '📋',
    title: '1. Information We Collect',
    content:
      'We collect personal data such as your name, email address, and any other information you provide while using our platform.',
  },
  {
    icon: '🔎',
    title: '2. How We Use Your Information',
    content:
      'We use your data to improve our services, personalize your experience, and ensure security.',
  },
  {
    icon: '🤝',
    title: '3. Sharing Your Information',
    content:
      'We do not sell your personal information. However, we may share it with trusted third-party services for essential functions.',
  },
  {
    icon: '🔒',
    title: '4. Data Security',
    content: 'We implement strong security measures to protect your information.',
  },
  {
    icon: '✉️',
    title: '5. Contact Us',
    content: (
      <>
        If you have any questions, contact us at{' '}
        <a
          href="mailto:support@match4good.com"
          style={{
            color: '#4CAF50',
            textDecoration: 'underline',
            fontWeight: 600,
          }}
        >
          support@match4good.com
        </a>
        .
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <div
      style={{
        fontFamily: 'Inter, Arial, sans-serif',
        background: 'linear-gradient(120deg, #e8f5e9 0%, #f1f8e9 100%)',
        minHeight: '100vh',
        padding: '0',
      }}
    >
      <section
        style={{
          maxWidth: '850px',
          margin: '0 auto',
          padding: '3rem 2rem 2rem 2rem',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(56, 142, 60, 0.10)',
            padding: '2.5rem 2rem 2rem 2rem',
            border: '1px solid #c8e6c9',
          }}
        >
          <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                color: '#388e3c',
                marginBottom: '0.5rem',
              }}
            >
              Privacy Policy
            </h1>
            <div style={{ color: '#388e3c', fontSize: '1rem', marginBottom: '1.5rem' }}>
              Last updated: March 2025
            </div>
            <p
              style={{
                fontSize: '1.15rem',
                color: '#444',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Welcome to Match4Good! Your privacy is important to us. This Privacy Policy explains
              how we collect, use, and protect your information.
            </p>
          </header>

          {/* Policy Sections */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2.2rem',
            }}
          >
            {sections.map((section) => (
              <section
                key={section.title}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.3rem',
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    flexShrink: 0,
                    marginTop: '0.2rem',
                    color: '#388e3c',
                  }}
                >
                  {section.icon}
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: '1.25rem',
                      color: '#388e3c',
                      fontWeight: 700,
                      marginBottom: '0.4rem',
                    }}
                  >
                    {section.title}
                  </h2>
                  <p
                    style={{
                      color: '#4a5568',
                      fontSize: '1.05rem',
                      margin: 0,
                    }}
                  >
                    {section.content}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          color: '#388e3c',
          fontSize: '0.95rem',
          padding: '2rem 0 0.5rem 0',
        }}
      >
        &copy; {new Date().getFullYear()} Match4Good. All rights reserved.
      </footer>
    </div>
  );
}
