import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Political Adda",
  description: "Get in touch with Political Adda for collaborations, advertisements, interviews, or any other queries. We aim to respond within 24-48 hours.",
};

export default function ContactPage() {
  const contactOptions = [
    "Interviews",
    "Political collaborations",
    "Advertising & promotions",
    "Feedback and complaints"
  ];

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-red-600 pb-2 inline-block">
          Contact Us
        </h1>

        <div className="prose prose-lg text-gray-700 mb-12">
          <p className="text-lg">
            If you would like to get in touch with us for collaborations, advertisements, interviews, or any other queries, please contact us through the following channels:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex items-start p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors">
            <div className="bg-red-100 p-3 rounded-xl mr-4">
              <Mail className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Email</p>
              <a href="mailto:thepoliticaladda01@gmail.com" className="text-lg font-bold text-gray-900 hover:text-red-600 transition-colors">
                thepoliticaladda01@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors">
            <div className="bg-red-100 p-3 rounded-xl mr-4">
              <Phone className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Phone</p>
              <a href="tel:8595775005" className="text-lg font-bold text-gray-900 hover:text-red-600 transition-colors">
                8595775005
              </a>
            </div>
          </div>

          <div className="flex items-start p-6 bg-gray-50 rounded-2xl border border-gray-100 col-span-1 md:col-span-2">
            <div className="bg-red-100 p-3 rounded-xl mr-4">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Location</p>
              <p className="text-lg font-bold text-gray-900">India</p>
            </div>
          </div>
        </div>

        <div className="bg-red-600 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">For inquiries related to:</h2>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {contactOptions.map((option) => (
                <span key={option} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                  {option}
                </span>
              ))}
            </div>
            <p className="text-red-100 flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              We aim to respond within 24–48 hours.
            </p>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
