import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 pt-12 pb-8 border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-lg text-xl shadow tracking-tight w-max">
                Political<span className="text-red-200"> Adda</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Unbiased, fast, and reliable political news from across India. We bring you the stories that matter.
            </p>
            <div className="flex space-x-2 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors text-xs font-bold bg-gray-800 px-2 py-1 rounded"
              >
                FB
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-sky-400 transition-colors text-xs font-bold bg-gray-800 px-2 py-1 rounded"
              >
                TW
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors text-xs font-bold bg-gray-800 px-2 py-1 rounded"
              >
                YT
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors text-xs font-bold bg-gray-800 px-2 py-1 rounded"
              >
                IG
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/category/politics" className="hover:text-white transition-colors">
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/category/national" className="hover:text-white transition-colors">
                  National
                </Link>
              </li>
              <li>
                <Link href="/category/entertainment" className="hover:text-white transition-colors">
                  Entertainment
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="hover:text-white transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/category/technology" className="hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* States */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
              States
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/state/bihar" className="hover:text-white transition-colors">
                  Bihar
                </Link>
              </li>
              <li>
                <Link href="/state/uttar-pradesh" className="hover:text-white transition-colors">
                  Uttar Pradesh
                </Link>
              </li>
              <li>
                <Link href="/state/delhi" className="hover:text-white transition-colors">
                  Delhi
                </Link>
              </li>
              <li>
                <Link href="/state/maharashtra" className="hover:text-white transition-colors">
                  Maharashtra
                </Link>
              </li>
              <li>
                <Link href="/state/west-bengal" className="hover:text-white transition-colors">
                  West Bengal
                </Link>
              </li>
              <li>
                <Link href="/state/rajasthan" className="hover:text-white transition-colors">
                  Rajasthan
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Tip */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
            <h3 className="text-white font-bold mb-3 uppercase text-sm tracking-wider">
              Tip Us Off
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Have a story? Send us a news tip securely.
            </p>
            <Link
              href="/submissions/new"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Submit News Tip
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-red-400 font-semibold">Political Adda</span>. All rights reserved.
          </p>
          <p className="mt-2 md:mt-0">Built with Next.js &amp; Firebase</p>
        </div>
      </div>
    </footer>
  );
}
