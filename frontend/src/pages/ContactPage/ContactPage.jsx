import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate form submission
    console.log('Form data submitted:', formData);
    setTimeout(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 3000); // Clear status after 3 seconds
    }, 1500);
  };

  return (
    <div className="contact-page-container">
      <div className="contact-header">
        <h1 className="contact-title">Get in Touch</h1>
      </div>

      <div className="contact-content-wrapper">
        {/* Left Side: Contact Information */}
        <div className="contact-info-side">
          <div className="contact-info-item">
            <div className="contact-icon-wrapper">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="contact-info-title">Email</h3>
              <p className="contact-info-text">Our friendly team is here to help.</p>
              <a href="mailto:contact@eskillveda.com" className="contact-info-link">contact@eskillveda.com</a>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon-wrapper">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="contact-info-title">Phone</h3>
              <p className="contact-info-text">Mon-Fri from 9am to 5pm.</p>
              <a href="tel:+910000000000" className="contact-info-link">+91 (XXX) XXX-XXXX</a>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon-wrapper">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="contact-info-title">Office</h3>
              <p className="contact-info-text">Come say hello at our office HQ.</p>
              <p className="contact-info-address">Ground Floor, Vedant Complex<br/>Sontola, Assam, India</p>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="contact-form-side">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="input-field"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="input-field"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Query</label>
              <textarea
                id="message"
                name="message"
                className="input-field"
                rows="6"
                placeholder="Please describe your query in detail..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-primary submit-btn" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
              <Send size={16} />
            </button>
            {status === 'sent' && <p className="success-message">Thank you! Your message has been sent.</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
