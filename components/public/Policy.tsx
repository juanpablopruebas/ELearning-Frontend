export const Policy = () => {
  return (
    <main className="container mx-auto pt-16 pb-8">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-lg leading-relaxed mb-10 text-center">
          Your privacy is important to us. This Privacy Policy outlines how we
          collect, use, and protect your information.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We collect personal information that you provide when registering,
              such as your name, email address, and payment details. We may also
              collect technical data like IP addresses and device information to
              improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              Your data is used to deliver our services, personalize your
              learning experience, send updates, and process transactions. We
              never sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Data Protection</h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We implement industry-standard security measures to protect your
              data. However, no online platform can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We use cookies to enhance your experience, remember preferences,
              and analyze traffic. You can control cookies through your browser
              settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Changes to This Policy
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We may update this policy from time to time. We will notify you of
              significant changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              If you have any questions about this policy, please contact us at{" "}
              <a
                href="mailto:privacy@elearning.com"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                privacy@elearning.com
              </a>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
};
