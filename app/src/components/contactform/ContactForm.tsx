"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import styles from "./ContactForm.module.css";
import API from "../../utils/api";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [longtext, setLongtext] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API}/contact`, {
        name,
        email,
        longtext,
        imageUrl,
      });
      setMessage(response.data.message);
    } catch {
      setMessage("There was an error submitting your form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className={styles.contactFormContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.contactForm}>
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              value={longtext}
              onChange={(e) => setLongtext(e.target.value)}
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="imageUrl">Image URL (Optional):</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        {message && (
          <motion.div
            className={styles.message}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p>{message}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ContactForm;
