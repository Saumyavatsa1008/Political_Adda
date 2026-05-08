import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Political Adda",
  description: "Learn more about Political Adda, our mission, and our team dedicated to unbiased journalism and ground-level political insights across India.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-red-600 pb-2 inline-block">
          About Us
        </h1>
        
        <div className="prose prose-lg text-gray-700 space-y-6">
          <p className="text-xl font-medium text-gray-900 leading-relaxed">
            Political Adda is a dynamic digital media platform dedicated to delivering news, analysis, and ground-level insights on politics and social issues across India.
          </p>

          <p>
            Our mission is to present facts, amplify public voices, and bring real stories from the ground without bias or fear. Through our content, we aim to create an informed and aware society.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">On Political Adda, you will find:</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ground reports</li>
              <li>Political analysis</li>
              <li>Exclusive interviews</li>
              <li>Public opinion videos</li>
              <li>Election coverage</li>
            </ul>
          </div>

          <p>
            We believe in responsible journalism and strive to maintain credibility, transparency, and authenticity in our work.
          </p>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Impact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Founder</p>
                <p className="text-xl font-bold text-red-600">Chandrakesh Rudra Chauhan</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Platform Reach</p>
                <p className="text-xl font-bold text-gray-900">200M+</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Subscribers</p>
                <p className="text-xl font-bold text-gray-900">1.5M</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Followers</p>
                <p className="text-xl font-bold text-gray-900">1M+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
