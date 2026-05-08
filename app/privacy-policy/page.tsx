import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Political Adda",
  description: "Read the Privacy Policy of Political Adda to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 border-b-4 border-red-600 pb-2 inline-block">
            Privacy Policy
          </h1>
          <p className="mt-8 text-xl text-gray-700 leading-relaxed italic">
            At Political Adda, we respect your privacy and are committed to protecting your personal information.
          </p>
        </header>

        <div className="space-y-12 text-gray-800">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3 text-sm">01</span>
              Information We Collect
            </h2>
            <p className="mb-4">We may collect the following types of information when you interact with our platform:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Name (if voluntarily provided)",
                "Email address",
                "Device and browser information",
                "Cookies and usage data"
              ].map((item) => (
                <li key={item} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3 text-sm">02</span>
              How We Use Your Data
            </h2>
            <ul className="space-y-4">
              {[
                "Improve website performance and user experience.",
                "Personalize content to better match your interests.",
                "Communicate with users regarding updates, newsletters, or queries."
              ].map((item) => (
                <li key={item} className="p-4 bg-gray-50 rounded-xl border-l-4 border-red-500">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-gray-900 text-white p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              We do not sell or share your personal information with third parties. Your trust is our priority, and we maintain strict security measures to protect your data.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="font-bold text-red-400 mb-2">Cookies</h3>
                <p>Our website may use cookies to enhance user experience and analyze traffic.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="font-bold text-red-400 mb-2">Third-party Links</h3>
                <p>We are not responsible for the privacy practices of third-party websites linked on our platform.</p>
              </div>
            </div>
          </section>

          <footer className="pt-8 border-t border-gray-100">
            <p className="text-center text-gray-500 font-medium">
              By using our website, you agree to this Privacy Policy.
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
}
