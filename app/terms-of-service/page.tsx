import type { Metadata } from "next";
import { Scale, AlertCircle, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Political Adda",
  description: "Read the Terms of Service for Political Adda. By accessing our platform, you agree to these legal conditions and guidelines.",
};

export default function TermsOfServicePage() {
  const terms = [
    "Content is for informational and journalistic purposes only.",
    "Unauthorized use or reproduction is prohibited.",
    "Users must not engage in illegal or abusive behavior.",
    "We do not guarantee complete accuracy of information.",
    "We are not responsible for third-party links.",
    "Terms may be updated anytime without notice.",
    "Political Adda is not liable for any damages from usage."
  ];

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 border-b-4 border-red-600 pb-2 inline-block">
            Terms of Service
          </h1>
          <p className="mt-8 text-lg text-gray-600">
            By accessing Political Adda, you agree to comply with and be bound by the following terms and conditions of use.
          </p>
        </header>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center mb-6 text-red-600">
              <Scale className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">User Agreement</h2>
            </div>
            <ul className="space-y-4">
              {terms.map((term, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-white border border-gray-200 text-gray-500 rounded-lg flex items-center justify-center font-bold text-sm mr-4 shadow-sm">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 pt-1 leading-relaxed">{term}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-2 border-red-100 rounded-3xl p-8 bg-red-50/30">
            <div className="flex items-center mb-6 text-red-700">
              <AlertCircle className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Disclaimer</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start bg-white p-4 rounded-xl shadow-sm border border-red-100">
                <div className="bg-red-100 p-2 rounded-lg mr-3 mt-1">
                  <Info className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-gray-700 font-medium">
                  Views expressed are personal opinions and do not reflect Political Adda’s official stance.
                </p>
              </div>
              <div className="flex items-start bg-white p-4 rounded-xl shadow-sm border border-red-100">
                <div className="bg-red-100 p-2 rounded-lg mr-3 mt-1">
                  <Info className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-gray-700 font-medium">
                  Content is for informational and journalistic purposes only.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Last updated: April 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
