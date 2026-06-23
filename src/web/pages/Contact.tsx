import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { useTranslation } from 'react-i18next';
export default function Contact() {
  const { addMessage, settings } = useData();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      addMessage(formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1000);
  };
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="text-5xl md:text-6xl font-display font-bold mb-6">
            
            {t('getInTouchStart')}<span className="text-accent-green">{t('contactUs')}</span>
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1
            }}
            className="text-lg text-secondary max-w-2xl mx-auto">
            
            {t('contactSubheader')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{
              opacity: 0,
              x: -30
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: 0.2
            }}>
            
            <h2 className="text-3xl font-display font-bold mb-8">
              {t('projectTalk')}
            </h2>
            <p className="text-secondary mb-12 leading-relaxed">
              {t('contactCopy')}
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-accent-green/10 text-accent-green flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-tertiary mb-1">
                    {t('emailMe')}
                  </h4>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-xl font-bold hover:text-accent-green transition-colors">
                    
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-tertiary mb-1">
                    {t('callMe')}
                  </h4>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-xl font-bold hover:text-accent-blue transition-colors">
                    
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-accent-orange/10 text-accent-orange flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-tertiary mb-1">
                    {t('locationLabel')}
                  </h4>
                  <p className="text-xl font-bold">{settings.location}</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-color">
              <h4 className="font-bold mb-4">Follow Me</h4>
              <div className="flex gap-4">
                {settings.socialLinks.map((link) =>
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-secondary border border-color flex items-center justify-center text-primary hover:bg-primary hover:border-accent-green hover:text-accent-green transition-all">
                  
                    {/* Simplified icon rendering for mock data */}
                    <span className="text-sm font-bold">
                      {link.platform[0]}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{
              opacity: 0,
              x: 30
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: 0.3
            }}
            className="bg-secondary p-8 md:p-10 rounded-[2rem] border border-color shadow-xl relative overflow-hidden">
            
            {isSuccess ?
            <div className="absolute inset-0 bg-secondary flex flex-col items-center justify-center p-8 text-center z-10">
                <motion.div
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1
                }}
                className="w-20 h-20 bg-accent-green/20 text-accent-green rounded-full flex items-center justify-center mb-6">
                
                  <CheckCircle2 size={40} />
                </motion.div>
                <h3 className="text-3xl font-display font-bold mb-4">
                  {t('messageSentTitle')}
                </h3>
                <p className="text-secondary mb-8">
                  {t('messageSentBody')}
                </p>
                <button
                onClick={() => setIsSuccess(false)}
                className="bg-primary border border-color px-8 py-3 rounded-xl font-medium hover:bg-tertiary transition-colors">
                
                  {t('sendAnotherMessage')}
                </button>
              </div> :
            null}

<h3 className="text-2xl font-bold mb-8">{t('sendMessage')}</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-secondary mb-2">
                  
                  {t('yourName')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-primary border border-color rounded-xl px-5 py-4 text-primary focus:outline-none focus:border-accent-green transition-colors"
                  placeholder={t('yourName')} />
                
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-secondary mb-2">
                  
                  {t('yourEmail')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-primary border border-color rounded-xl px-5 py-4 text-primary focus:outline-none focus:border-accent-green transition-colors"
                  placeholder={t('yourEmail')} />
                
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-secondary mb-2">
                  
                  {t('yourMessage')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-primary border border-color rounded-xl px-5 py-4 text-primary focus:outline-none focus:border-accent-green transition-colors resize-none"
                  placeholder={t('yourMessage')}>
                </textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent-green hover:bg-accent-green/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                
                {isSubmitting ? t('sending') : t('sendMessage')}
                {!isSubmitting && <Send size={20} />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>);

}