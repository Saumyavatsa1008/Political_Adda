import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

const dummyPosts = [
  {
    title: "Election Commission Announces Polling Dates for Key State Assemblies",
    slug: "election-commission-announces-polling-dates-2026",
    description: "The Election Commission of India has announced the dates for the upcoming assembly elections in crucial states. Polling will take place in multiple phases starting next month.",
    content: "The highly anticipated schedule for the upcoming assembly elections has finally been released... \n\nThe Chief Election Commissioner stated that all preparations are in place. Special security measures are being deployed in sensitive constituencies to ensure free and fair voting.\n\nPolitical parties have already begun releasing their first list of candidates. The ruling coalition is expressing confidence in returning to power, while the opposition alliance smells anti-incumbency across the rural belt.",
    thumbnailUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80",
    category: "National",
    tags: ["elections", "eci", "breaking"],
    youtubeLink: "",
    isPublished: true,
    authorId: "admin-user",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Ground Report: Rural Voters Demand Better Infrastructure Ahead of Polls",
    slug: "ground-report-rural-voters-infrastructure",
    description: "In our latest ground report from the heartland, voters are clear about their primary demand: concrete roads, consistent power supply, and better healthcare.",
    content: "As we traveled through the dusty roads of the state's interior, a common theme emerged among the electorate. The promises of the past five years ring hollow when the nearest primary healthcare center is 20 kilometers away.\n\nWe spoke to several farmers who highlighted that irrigation support has been lackluster this season. 'We don't need freebies, we need a reliable supply chain for our crops,' said one local leader.\n\nThis sentiment could prove challenging for the sitting MLA who won by a narrow margin last time.",
    thumbnailUrl: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800&q=80",
    category: "Ground Reports",
    tags: ["rural", "infrastructure", "farmers"],
    youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
    isPublished: true,
    authorId: "admin-user",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Major Shift in Bihar Politics: New Alliance Takes Shape",
    slug: "major-shift-bihar-politics-new-alliance",
    description: "In a stunning midnight development, two former political rivals have agreed to enter a pre-poll alliance, changing the electoral arithmetic completely.",
    content: "In what political analysts are calling a masterstroke, the formation of this new coalition alters the caste calculus in at least 40 constituencies.\n\nThe alliance was formally announced at a joint press conference early this morning. Leaders from both camps emphasized 'development' as their common minimum program, though experts see this clearly as a survival strategy against the rising dominant party.\n\nSupporters have started celebrating, but the real test lies in ticket distribution, which is expected to be a thorny issue.",
    thumbnailUrl: "https://images.unsplash.com/photo-1555811737-cbdfbcee3011?w=800&q=80",
    category: "Bihar",
    tags: ["bihar", "alliances", "breaking"],
    youtubeLink: "",
    isPublished: true,
    authorId: "admin-user",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }
];

const dummyPoll = {
  question: "Who holds the edge in the upcoming State Assembly Elections?",
  options: [
    { id: "1", text: "Ruling Alliance", votes: 124 },
    { id: "2", text: "Opposition Coalition", votes: 156 },
    { id: "3", text: "New Third Front", votes: 32 },
    { id: "4", text: "Too Close To Call", votes: 89 },
  ],
  isActive: true,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function seed() {
  console.log("Starting DB Seeding...");
  try {
    // 1. Seed Posts
    for (const post of dummyPosts) {
      await db.collection("posts").add(post);
    }
    console.log(`✅ Seeded ${dummyPosts.length} dummy articles.`);

    // 2. Seed Poll
    await db.collection("polls").add(dummyPoll);
    console.log("✅ Seeded dummy poll.");

    console.log("Seeding complete! You can now visit localhost:3000 to see data.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seed();
