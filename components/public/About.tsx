export const About = () => {
  return (
      <main className="container mx-auto pt-16 pb-8">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
        <p className="text-lg leading-relaxed mb-8 text-center">
          Welcome to ELearning — a platform built to empower learners across the
          globe with access to quality education. Our mission is to make
          learning accessible, engaging, and effective for everyone.
        </p>

        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              Founded in 2025, ELearning began as a passion project among
              educators and developers who wanted to bridge the gap in online
              education. We&apos;ve grown into a full-featured platform trusted
              by thousands of students and professionals worldwide.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              To become the most learner-centered platform in the world,
              offering high-quality courses that are not only informative but
              also inspiring. We aim to support lifelong learning and help
              individuals achieve their personal and professional goals.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-zinc-700 dark:text-zinc-300">
            Have questions or feedback? Reach out to us at{" "}
            <a
              href="mailto:test@test.com"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              test@test.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
};
