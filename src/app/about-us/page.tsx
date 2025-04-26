'use client';
import React from 'react';

// Emoji icons for visual engagement
const values = [
  {
    icon: '🤝',
    title: 'Connection',
    desc: 'We bring together passionate volunteers and organizations making a difference.',
  },
  {
    icon: '🌍',
    title: 'Impact',
    desc: 'Every match creates positive change in communities across the UK.',
  },
  {
    icon: '💡',
    title: 'Accessibility',
    desc: 'We believe everyone should have the opportunity to give back, easily and meaningfully.',
  },
];

export default function AboutUsPage() {
  return (
    <div
      style={{
        fontFamily: 'Inter, Arial, sans-serif',
        background: 'linear-gradient(120deg, #f0f4f9 0%, #e6f7fa 100%)',
        minHeight: '100vh',
        padding: '0',
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '3rem 2rem 2rem 2rem',
          textAlign: 'center',
        }}
      >
        <div style={{
          fontSize: '3.5rem',
          marginBottom: '1rem',
        }}>🌟</div>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          color: '#2d3748',
          marginBottom: '0.5rem',
        }}>
          Welcome to Match4Good
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#4a5568',
          marginBottom: '2rem',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Your journey to making a difference starts here. We connect caring people with causes that matter.
        </p>
      </section>

      {/* Our Values */}
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '2rem',
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 4px 24px rgba(44, 62, 80, 0.10)',
          marginBottom: '2.5rem',
        }}
      >
        <h2 style={{
          fontSize: '2rem',
          color: '#22577A',
          fontWeight: 700,
          marginBottom: '1.2rem',
          textAlign: 'center',
        }}>
          Our Core Values
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '2rem',
        }}>
          {values.map((val) => (
            <div key={val.title} style={{
              flex: '1 1 220px',
              minWidth: '220px',
              maxWidth: '260px',
              background: '#f7fafc',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(44, 62, 80, 0.06)',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{val.icon}</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.3rem' }}>{val.title}</h3>
              <p style={{ color: '#4a5568', fontSize: '1rem' }}>{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission and Contact */}
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '2rem',
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 4px 24px rgba(44, 62, 80, 0.10)',
          marginBottom: '2.5rem',
        }}
      >
        <h2 style={{
          fontSize: '1.75rem',
          color: '#22577A',
          fontWeight: 700,
          marginBottom: '1rem',
        }}>
          Our Mission
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#444',
          marginBottom: '2rem',
        }}>
          At <strong>Match4Good</strong>, we believe that volunteering should be simple, rewarding, and impactful. Our mission is to bridge the gap between volunteers and organizations in need, making it easy for everyone to give back and create positive change-one match at a time.
        </p>

        <h2 style={{
          fontSize: '1.75rem',
          color: '#22577A',
          fontWeight: 700,
          marginBottom: '1rem',
        }}>
          Get Involved
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#444',
          marginBottom: '2rem',
        }}>
          Whether you’re an individual eager to volunteer or an organization seeking passionate helpers, Match4Good is here for you. Explore opportunities, connect, and start making a difference today!
        </p>

        <h2 style={{
          fontSize: '1.75rem',
          color: '#22577A',
          fontWeight: 700,
          marginBottom: '1rem',
        }}>
          Contact Us
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#444',
        }}>
          Have questions or want to collaborate? Reach out at{' '}
          <a
            href="mailto:support@match4good.com"
            style={{
              color: '#36d1c4',
              textDecoration: 'underline',
              fontWeight: 600,
            }}
          >
            support@match4good.com
          </a>
          .
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        color: '#7b8fa1',
        fontSize: '0.95rem',
        padding: '1.5rem 0 0.5rem 0',
      }}>
        &copy; {new Date().getFullYear()} Match4Good. All rights reserved.
      </footer>
    </div>
  );
}
