import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, XCircle, Sparkles } from 'lucide-react'; // Import Sparkles icon

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Inject global CSS for blob animations (if not already in a global stylesheet)
    const style = document.createElement('style');
    style.id = 'contact-page-animations';
    style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
            animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
        .animation-delay-4000 {
            animation-delay: 4s;
        }
    `;

    if (!document.getElementById('contact-page-animations')) {
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById('contact-page-animations');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Clear error for the field being typed into
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setMessageType('');
    setErrors({});

    if (!validateForm()) {
      setStatusMessage('Please correct the errors in the form.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    // In a real application, you would send this data to your backend API
    console.log('Form Data Submitted:', formData);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Replace with actual axios.post to your backend:
      // const response = await axios.post(`${API_BASE_URL}/contact`, formData);

      setStatusMessage('Your message has been sent successfully!');
      setMessageType('success');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (error) {
      console.error('Error sending message:', error);
      setStatusMessage('Failed to send message. Please try again later.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
      {/* Background blobs - copied from ChangeUsername/DeleteAccount for consistency */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-orange-300 dark:bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-lime-300 dark:bg-lime-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 animate-fade-in">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Added Sparkles Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <Sparkles className="mx-auto w-16 h-16 text-yellow-400 dark:text-yellow-300" strokeWidth={1.5} />
          </motion.div>

          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            We'd love to hear from you! Reach out for any questions or feedback.
          </p>
        </motion.div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Contact Information Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 lg:mb-0 p-8 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner border border-gray-200 dark:border-gray-600"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Details</h2>
            <div className="space-y-6">
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Mail className="w-6 h-6 mr-4 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-lg">Email Us</h3>
                  <p className="text-blue-600 dark:text-blue-400">support@pitchbridge.com</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Phone className="w-6 h-6 mr-4 text-green-500" />
                <div>
                  <h3 className="font-semibold text-lg">Call Us</h3>
                  <p className="text-green-600 dark:text-green-400">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <MapPin className="w-6 h-6 mr-4 text-purple-500" />
                <div>
                  <h3 className="font-semibold text-lg">Our Office</h3>
                  <p>123 PitchBridge Lane,</p>
                  <p>Startup City, ST 98765</p>
                </div>
              </div>
            </div>
            {/* Optional: Add a simple map or social media links here */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Find Us On:</h3>
              <div className="flex space-x-4">
                {/* Replace with actual social media icons/links if desired */}
                <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-300 transition-colors">Facebook</a>
                <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-300 transition-colors">Twitter</a>
                <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-300 transition-colors">LinkedIn</a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner border border-gray-200 dark:border-gray-600"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Send Us A Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className={`w-full p-3 rounded-md bg-white dark:bg-gray-800 border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  disabled={isLoading}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`w-full p-3 rounded-md bg-white dark:bg-gray-800 border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  disabled={isLoading}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Regarding..."
                  className={`w-full p-3 rounded-md bg-white dark:bg-gray-800 border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  disabled={isLoading}
                />
                {errors.subject && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Your detailed message..."
                  className={`w-full p-3 rounded-md bg-white dark:bg-gray-800 border text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  disabled={isLoading}
                ></textarea>
                {errors.message && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold text-white
                            transition-all duration-300 ease-in-out shadow-md hover:shadow-lg
                            ${isLoading
                                ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                            }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>

            {statusMessage && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mt-6 p-4 rounded-lg flex items-center gap-3 justify-center
                    ${messageType === 'success'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-700'
                    }`}
                role="alert"
              >
                {messageType === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                <span className="text-sm font-medium">{statusMessage}</span>
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;