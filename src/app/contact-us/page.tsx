'use client';
import React, { useState } from 'react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

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
          maxWidth: '500px',
          margin: '0 auto',
          padding: '3rem 1.5rem',
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
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📬</div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#388e3c',
                marginBottom: '0.5rem',
              }}
            >
              Contact Us
            </h1>
            <p
              style={{
                color: '#388e3c',
                fontSize: '1.08rem',
                maxWidth: '350px',
                margin: '0 auto',
              }}
            >
              We'd love to hear from you! Fill out the form below and our team will get back to you
              as soon as possible.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #c8e6c9',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border 0.2s',
              }}
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #c8e6c9',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border 0.2s',
              }}
              required
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #c8e6c9',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border 0.2s',
              }}
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #c8e6c9',
                borderRadius: '8px',
                fontSize: '1rem',
                minHeight: '100px',
                outline: 'none',
                resize: 'vertical',
                transition: 'border 0.2s',
              }}
              required
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(90deg, #4CAF50 0%, #81C784 100%)',
                color: '#fff',
                fontWeight: 600,
                padding: '0.85rem 0',
                borderRadius: '32px',
                fontSize: '1.08rem',
                border: 'none',
                boxShadow: '0 2px 12px rgba(56, 142, 60, 0.08)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Send Message
            </button>
            {submitted && (
              <div
                style={{
                  background: '#e8f5e9',
                  color: '#388e3c',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  textAlign: 'center',
                  fontWeight: 600,
                  marginTop: '0.5rem',
                  border: '1px solid #c8e6c9',
                }}
              >
                Message sent! We'll get back to you soon.
              </div>
            )}
          </form>

          <div
            style={{
              marginTop: '2.5rem',
              textAlign: 'center',
              color: '#388e3c',
              fontSize: '0.98rem',
            }}
          >
            Or email us directly at{' '}
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
