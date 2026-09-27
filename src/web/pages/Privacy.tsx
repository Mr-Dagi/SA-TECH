import React from 'react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-primary py-16 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8 text-accent-orange">
          Privacy Policy
        </h1>
        <div className="bg-secondary rounded-2xl border border-color p-8 space-y-6 text-secondary leading-relaxed">
          <p>
            Last updated: {new Date().getFullYear()}
          </p>
          <p>
            SA-Tech Startup ("we," "our," "us") values your privacy. This Privacy Policy
            explains how we collect, use, store, and disclose information when you visit
            our website at sa-tech-startup.com.
          </p>

          <h2 className="text-2xl font-display font-bold mt-6 text-accent-blue">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly, such as your name, email address,
            and message content when you contact us through our website. We also collect
            technical information about your device and browser.
          </p>

          <h2 className="text-2xl font-display font-bold mt-6 text-accent-blue">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information we collect to respond to your inquiries, improve our
            services, and communicate with you regarding your requests. Your data is stored
            securely on our Supabase backend.
          </p>

          <h2 className="text-2xl font-display font-bold mt-6 text-accent-blue">
            3. Data Sharing
          </h2>
          <p>
            We do not sell or trade your personal information. We may share data with
            trusted service providers who help us operate our website, such as Supabase for
            database hosting and EmailJS for email notifications.
          </p>

          <h2 className="text-2xl font-display font-bold mt-6 text-accent-blue">
            4. Data Security
          </h2>
          <p>
            We implement reasonable security measures to protect your information. However,
            no method of transmission over the internet is 100% secure.
          </p>

          <h2 className="text-2xl font-display font-bold mt-6 text-accent-blue">
            5. Your Rights
          </h2>
          <p>
            You may request access to, correction of, or deletion of your personal data
            at any time. Contact us at mrx@yourdomain.com to exercise these rights.
          </p>

          <h2 className="text-2xl font-display font-bold mt-6 text-accent-blue">
            6. Cookies
          </h2>
          <p>
            We use cookies and similar technologies to enhance your experience on our website.
            You can control cookie preferences through your browser settings.
          </p>

          <h2 className="text-2xl font-display font-bold mt-6 text-accent-blue">
            7. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:mrx@yourdomain.com" className="text-accent-orange underline">
              mrx@yourdomain.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
