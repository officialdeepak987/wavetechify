
import type { LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  icon: string; // Storing icon name as string
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  points: string[];
  tags: string[];
  image: string;
  imageHint: string;
  bgColor: string;
  textColor: string;
}

export interface Project {
  id: string;
  slug: string;
  image: string;
  imageHint: string;
  category: string;
  title: string;
  description: string;
  longDescription: string;
  client: string;
  location: string;
  completedDate: string;
  requirements: string[];
  solution: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  company: string;
  image: string;
  imageHint: string;
}

export interface Post {
  id: string;
  slug: string;
  image: string;
  imageHint: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  content: string;
  redirectUrl?: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    imageHint: string;
    twitter?: string;
    linkedin?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  faqs: FaqItem[];
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string; // Stored as 'YYYY-MM-DD' string
  preferredDate?: string | null; // Stored as 'YYYY-MM-DD' string or null
}

export interface SiteSettings {
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  twitterUrl: string;
  linkedinUrl: string;
  githubUrl: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceSuffix: string;
  features: string[];
}

export interface CountryPricing {
  countryCode: string;
  name: string;
  currency: string;
  currencySymbol: string;
  plans: PricingPlan[];
}

export interface PricingData {
  [key: string]: Omit<CountryPricing, 'countryCode'>;
}

export interface Technology {
  id: string;
  name: string;
}

export interface HomepageContent {
  hero: {
    greeting: string;
    brandName: string;
    headline: string;
    subheadline: string;
    ctaButton: string;
    statCard1: {
      value: string;
      text: string;
    };
    featureCard: {
      features: string[];
    };
    progressCard: {
      value: string;
      text: string;
    };
  };
  about: {
    greeting: string;
    headline: string;
    subheadline: string;
    awardCard: {
      title: string;
      text: string;
    };
  };
  aboutPage: {
    greeting: string;
    headline: string;
    subheadline: string;
    missionCards: {
      icon: string;
      title: string;
      description: string;
    }[];
  };
  whyUs: {
    greeting: string;
    headline: string;
    subheadline: string;
    cards: {
        icon: string;
        title: string;
        description: string;
    }[];
  };
  workingProcess: {
    greeting: string;
    headline: string;
    steps: {
        title: string;
        content: string;
    }[];
  };
  faq: {
      headline: string;
      subheadline: string;
      items: FaqItem[];
  }
}
