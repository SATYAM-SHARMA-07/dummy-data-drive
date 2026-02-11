export interface Founder {
  id: string;
  name: string;
  initials: string;
  startup: string;
  bio: string;
  avatar?: string;
}

export interface PitchPost {
  id: string;
  founderId: string;
  title: string;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
  trending?: boolean;
  createdAt: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
}

export interface KnowledgeCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  articles: KnowledgeArticle[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  readTime: string;
}

export interface ReelCard {
  id: string;
  title: string;
  creator: string;
  creatorInitials: string;
  views: string;
  thumbnail: string;
}

export interface MasterclassEvent {
  id: string;
  title: string;
  speaker: string;
  date: string;
  time: string;
  live?: boolean;
  registered?: boolean;
}

export const founders: Founder[] = [
  { id: "1", name: "Aarav Sharma", initials: "AS", startup: "EcoRoute", bio: "Building sustainable logistics for Tier-2 cities" },
  { id: "2", name: "Priya Mehta", initials: "PM", startup: "HealthBridge", bio: "Making healthcare accessible in rural India" },
  { id: "3", name: "Rohan Gupta", initials: "RG", startup: "SkillForge", bio: "Upskilling blue-collar workers with micro-courses" },
  { id: "4", name: "Ananya Iyer", initials: "AI", startup: "FarmLink", bio: "Direct farm-to-consumer marketplace" },
  { id: "5", name: "Vikram Patel", initials: "VP", startup: "FinEase", bio: "Simplifying GST compliance for SMEs" },
  { id: "6", name: "Sneha Reddy", initials: "SR", startup: "EduSpark", bio: "Gamified learning for K-12 students" },
  { id: "7", name: "Karan Singh", initials: "KS", startup: "CloudKitchen+", bio: "AI-powered cloud kitchen management" },
  { id: "8", name: "Divya Nair", initials: "DN", startup: "GreenPack", bio: "Biodegradable packaging solutions" },
];

export const pitchPosts: PitchPost[] = [
  { id: "p1", founderId: "1", title: "EcoRoute — Green Logistics", description: "We're building an AI-powered logistics platform that optimizes delivery routes for minimal carbon footprint. Targeting Tier-2 cities where last-mile delivery is broken.", tags: ["CleanTech", "Logistics", "AI"], likes: 42, comments: 8, trending: true, createdAt: "2h ago" },
  { id: "p2", founderId: "2", title: "HealthBridge — Rural Telehealth", description: "Connecting rural patients with city doctors via low-bandwidth video consultations. We've already piloted in 3 villages with 200+ consultations.", tags: ["HealthTech", "Social Impact"], likes: 67, comments: 15, trending: true, createdAt: "4h ago" },
  { id: "p3", founderId: "3", title: "SkillForge — Micro-Upskilling", description: "5-minute daily courses for factory workers to learn new skills. Think Duolingo but for vocational training. Partnering with 2 manufacturing units.", tags: ["EdTech", "B2B"], likes: 31, comments: 5, createdAt: "6h ago" },
  { id: "p4", founderId: "4", title: "FarmLink — Farm to Fork", description: "Eliminating middlemen in agriculture. Farmers list produce, consumers buy direct. 30% better prices for farmers, fresher food for consumers.", tags: ["AgriTech", "Marketplace"], likes: 55, comments: 12, trending: true, createdAt: "8h ago" },
  { id: "p5", founderId: "5", title: "FinEase — GST Made Simple", description: "One-click GST filing for small businesses. Auto-reconciliation, smart categorization, and compliance alerts. Already have 50 paying customers.", tags: ["FinTech", "SaaS"], likes: 89, comments: 22, createdAt: "1d ago" },
  { id: "p6", founderId: "6", title: "EduSpark — Gamified Learning", description: "Making NCERT curriculum fun with AR-based learning modules. Kids earn rewards, parents track progress. Beta testing with 500 students.", tags: ["EdTech", "AR/VR"], likes: 38, comments: 9, createdAt: "1d ago" },
  { id: "p7", founderId: "7", title: "CloudKitchen+ — Smart Kitchen Ops", description: "AI predicts demand, optimizes inventory, and reduces food waste for cloud kitchens. Saves 25% operational costs on average.", tags: ["FoodTech", "AI", "B2B"], likes: 45, comments: 7, createdAt: "2d ago" },
  { id: "p8", founderId: "8", title: "GreenPack — Sustainable Packaging", description: "Plant-based packaging that decomposes in 90 days. Drop-in replacement for plastic packaging. Working with 3 D2C brands.", tags: ["CleanTech", "D2C"], likes: 72, comments: 18, createdAt: "2d ago" },
  { id: "p9", founderId: "1", title: "Looking for a co-founder!", description: "EcoRoute is growing fast and I need a technical co-founder with experience in route optimization algorithms. Equity split negotiable.", tags: ["Co-founder", "Hiring"], likes: 23, comments: 14, createdAt: "3d ago" },
  { id: "p10", founderId: "5", title: "Just got into Y Combinator!", description: "Excited to share that FinEase has been accepted into YC W26 batch! AMA about the application process.", tags: ["Milestone", "YC"], likes: 156, comments: 45, createdAt: "3d ago" },
];

export const defaultRoadmapSteps: RoadmapStep[] = [
  { id: "r1", title: "Validate Your Idea", description: "Talk to 50 potential customers and validate problem-solution fit", status: "completed" },
  { id: "r2", title: "Register Your Company", description: "Incorporate as Private Limited or LLP on MCA portal", status: "in-progress" },
  { id: "r3", title: "GST Registration", description: "Apply for GSTIN if annual turnover exceeds ₹20L", status: "not-started" },
  { id: "r4", title: "Apply for Startup India", description: "Get DPIIT recognition for tax benefits and funding access", status: "not-started" },
  { id: "r5", title: "Find an Incubator", description: "Apply to incubators like T-Hub, NSRCEL, or IIM programs", status: "not-started" },
  { id: "r6", title: "Build MVP & Launch", description: "Ship your minimum viable product and get first 100 users", status: "not-started" },
];

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: "k1", title: "Company Registration", icon: "Building2", color: "bg-primary/10 text-primary",
    articles: [
      { id: "a1", title: "Pvt Ltd vs LLP: Which is Right for You?", summary: "Compare the two most popular structures for Indian startups.", readTime: "5 min" },
      { id: "a2", title: "Step-by-Step MCA Registration Guide", summary: "Complete walkthrough of registering on the MCA portal.", readTime: "8 min" },
    ],
  },
  {
    id: "k2", title: "Government Schemes", icon: "Landmark", color: "bg-accent text-accent-foreground",
    articles: [
      { id: "a3", title: "Startup India: Benefits & How to Apply", summary: "Everything you need to know about DPIIT recognition.", readTime: "6 min" },
      { id: "a4", title: "MSME Registration Benefits", summary: "How Udyam registration can help your startup grow.", readTime: "4 min" },
    ],
  },
  {
    id: "k3", title: "License & Compliance", icon: "Shield", color: "bg-secondary text-secondary-foreground",
    articles: [
      { id: "a5", title: "GST for Startups: A Complete Guide", summary: "When to register, how to file, and common mistakes.", readTime: "7 min" },
      { id: "a6", title: "FSSAI License for Food Startups", summary: "Mandatory food safety compliance for food businesses.", readTime: "5 min" },
    ],
  },
  {
    id: "k4", title: "Funding & Incubators", icon: "Rocket", color: "bg-primary/10 text-primary",
    articles: [
      { id: "a7", title: "Top 20 Incubators in India (2026)", summary: "Curated list of the best startup incubators and accelerators.", readTime: "10 min" },
      { id: "a8", title: "How to Pitch to Angel Investors", summary: "Craft a winning pitch deck and nail your presentation.", readTime: "8 min" },
    ],
  },
];

export const reelCards: ReelCard[] = [
  { id: "v1", title: "How I Built a ₹1Cr Startup in 6 Months", creator: "Aarav Sharma", creatorInitials: "AS", views: "12K", thumbnail: "🚀" },
  { id: "v2", title: "3 Mistakes First-Time Founders Make", creator: "Priya Mehta", creatorInitials: "PM", views: "8.5K", thumbnail: "⚠️" },
  { id: "v3", title: "GST Filing Hack for Startups", creator: "Vikram Patel", creatorInitials: "VP", views: "5.2K", thumbnail: "💰" },
  { id: "v4", title: "My YC Interview Experience", creator: "Sneha Reddy", creatorInitials: "SR", views: "20K", thumbnail: "🎯" },
  { id: "v5", title: "Building in Public: Week 1", creator: "Karan Singh", creatorInitials: "KS", views: "3.1K", thumbnail: "🔨" },
];

export const masterclassEvents: MasterclassEvent[] = [
  { id: "e1", title: "From Idea to IPO: Fundraising Masterclass", speaker: "Nithin Kamath", date: "Feb 15, 2026", time: "6:00 PM IST", live: true },
  { id: "e2", title: "Legal Basics Every Founder Must Know", speaker: "Adv. Riya Kapoor", date: "Feb 18, 2026", time: "7:00 PM IST" },
  { id: "e3", title: "Growth Hacking for Early-Stage Startups", speaker: "Kunal Shah", date: "Feb 22, 2026", time: "5:30 PM IST" },
  { id: "e4", title: "Building a Remote-First Company", speaker: "Girish Mathrubootham", date: "Feb 28, 2026", time: "6:30 PM IST" },
];

export const currentUser: Founder = {
  id: "0",
  name: "Arjun Verma",
  initials: "AV",
  startup: "CoFound",
  bio: "Aspiring founder exploring the startup ecosystem. Passionate about connecting founders and building tools for the community.",
};
