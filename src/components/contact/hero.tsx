import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const ContactHero = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill out all required fields.');
      return;
    }

    // No mail backend yet: hand the message to the visitor's email app
    const body = `${formData.message}\n\n— ${formData.name}\n${formData.email}${formData.phone ? `\n${formData.phone}` : ''}`;
    window.location.href = `mailto:support@foodbridge.com?subject=${encodeURIComponent(`Message from ${formData.name}`)}&body=${encodeURIComponent(body)}`;
    toast.success('Opening your email app to send the message.');
  };

  return (
    <section className="w-full px-0 md:px-[7.5rem] max-w-[1440px] mx-auto">
      {/* Container card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full bg-brand-secondary rounded-t-[50px] md:rounded-t-[80px] rounded-b-none px-6 py-12 md:p-16 text-white shadow-[var(--shadow-xl)]"
      >
        <div className="max-w-[600px] mx-auto w-full">
          {/* Header Texts */}
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[2.5rem] md:text-[3.75rem] font-normal leading-tight tracking-tight mb-[0.3rem]"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#FFFFFF] text-base md:text-lg font-light leading-relaxed mb-[3.125rem]"
          >
            We're here to help, whether you're a vendor, a customer, or a partner.
          </motion.p>

          {/* Contact Interactive Form Element */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs font-light tracking-wide text-white/80">Your name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="w-full h-[54px] px-5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-light tracking-wide text-white/80">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yourname@gmail.com"
                  required
                  className="w-full h-[54px] px-5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all"
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs font-light tracking-wide text-white/80">Phone number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className="w-full h-[54px] px-5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all"
              />
            </div>

            {/* Message Box Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-light tracking-wide text-white/80">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write something..."
                required
                className="w-full p-5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all resize-none"
              />
            </div>

            {/* Submit Button Block */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full md:w-auto px-8 h-[54px] bg-[var(--brand-primary)] text-[var(--text-primary)] font-medium rounded-full hover:bg-white hover:text-[var(--brand-secondary)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-[160px]"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactHero;