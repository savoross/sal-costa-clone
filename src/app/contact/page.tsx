"use client";

import { Navbar } from "@/components/navigation/navbar";
import { CursorFollower } from "@/components/cursor/cursor-follower";
import { BlobBackground } from "@/components/background/blob-background";
import { SkillsMarquee } from "@/components/marquee/skills-marquee";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const skills = [
  "Web Design",
  "UX Design",
  "Frontend Development",
  "Web Design",
  "UX Design",
  "Frontend Development",
];

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset submission state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="page-wrapper">
      <CursorFollower />
      <BlobBackground />
      <Navbar />

      <main className="w-full max-w-screen-xl mx-auto py-24 px-6">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg mb-6">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Contact Details</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-secondary">Email:</span>
                  <a href="mailto:hello@salcosta.dev" className="hover:text-secondary transition-colors" data-cursor-hover>
                    hello@salcosta.dev
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-secondary">Location:</span>
                  <span>Barcelona, Spain</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Connect</h2>
              <div className="flex gap-4">
                <a
                  href="https://www.behance.net/salcc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-foreground flex items-center justify-center transition-colors duration-300 hover:bg-secondary hover:border-secondary"
                  data-cursor-hover
                >
                  BE
                </a>
                <a
                  href="https://www.linkedin.com/in/salcc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-foreground flex items-center justify-center transition-colors duration-300 hover:bg-secondary hover:border-secondary"
                  data-cursor-hover
                >
                  LI
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                  data-cursor-hover
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                  data-cursor-hover
                />
              </div>

              <div>
                <label htmlFor="subject" className="block mb-2 font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                  data-cursor-hover
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                  data-cursor-hover
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  isSubmitted
                    ? "bg-green-500 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                data-cursor-hover
              >
                {isSubmitting ? "Sending..." : isSubmitted ? "Message Sent!" : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      <SkillsMarquee skills={skills} />
    </div>
  );
}
