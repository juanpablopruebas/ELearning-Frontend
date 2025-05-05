import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="pt-12 pb-8 border-t border-black dark:border-white">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-4">About</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:underline">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/courses" className="hover:underline">
                Courses
              </Link>
            </li>
            {/* <li>
              <Link href="/profile" className="hover:underline">
                My Account
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:underline">
                Course Dashboard
              </Link>
            </li> */}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Social Links</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="https://www.youtube.com"
                className="hover:underline"
                target="_blank"
              >
                YouTube
              </Link>
            </li>
            <li>
              <Link
                href="https://www.instagram.com"
                className="hover:underline"
                target="_blank"
              >
                Instagram
              </Link>
            </li>
            <li>
              <Link
                href="https://github.com"
                className="hover:underline"
                target="_blank"
              >
                GitHub
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
          <ul className="space-y-2 text-sm">
            <li>Phone: +1 (234) 5698</li>
            <li>Address: 3032 Queens Lane</li>
            <li>
              Email:{" "}
              <Link href="mailto:test@test.com" className="hover:underline">
                test@test.com
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
        © 2025 E-Learning. All Rights Reserved.
      </div>
    </footer>
  );
};
