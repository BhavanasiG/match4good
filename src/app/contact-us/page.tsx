"use client";
import React, { useState } from "react";

export default function ContactUsPage() {
  const [form_data, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...form_data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form_data);
    alert("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={form_data.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form_data.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="subject"
          value={form_data.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="p-2 border rounded"
          required
        />
        <textarea
          name="message"
          value={form_data.message}
          onChange={handleChange}
          placeholder="Your Message"
          className="p-2 border rounded h-24"
          required
        />
        <button
          type="submit"
          className="bg-lime-500 text-white py-2 rounded hover:bg-lime-600"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
