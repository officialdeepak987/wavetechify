
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getSiteSettings } from "../admin/settings/_actions/settings-actions";

export default async function PrivacyPage() {
  const siteSettings = await getSiteSettings();
  return (
    <div className="bg-background">
      <section className="bg-primary/5 py-12">
        <div className="container flex justify-between items-center">
          <h1 className="text-4xl font-bold font-headline text-primary">Privacy Policy</h1>
          <div className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="inline-block mx-2 h-4 w-4" />
            <span>Privacy Policy</span>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="prose prose-lg max-w-none text-muted-foreground prose-headings:font-headline prose-headings:text-primary">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us. For example, we collect information when you create an account, subscribe, participate in any interactive features of our services, fill out a form, request customer support or otherwise communicate with us. The types of information we may collect include your name, email address, postal address, phone number, and any other information you choose to provide.
          </p>

          <h2>2. Use of Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, such as to administer your use of our services, to send you technical notices, updates, security alerts and support and administrative messages and to respond to your comments, questions and requests and provide customer service.
          </p>

          <h2>3. Sharing of Information</h2>
          <p>
            We may share information about you as follows or as otherwise described in this Privacy Policy:
          </p>
          <ul>
            <li>With vendors, consultants and other service providers who need access to such information to carry out work on our behalf;</li>
            <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation or legal process;</li>
            <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property and safety of Wavetechify.in or others;</li>
            <li>In connection with, or during negotiations of, any merger, sale of company assets, financing or acquisition of all or a portion of our business by another company;</li>
            <li>Between and among Wavetechify.in and our current and future parents, affiliates, subsidiaries and other companies under common control and ownership; and</li>
            <li>With your consent or at your direction.</li>
          </ul>

          <h2>4. Your Choices</h2>
          <p>
            You may update, correct or delete information about you at any time by logging into your online account or emailing us. If you wish to delete or deactivate your account, please email us, but note that we may retain certain information as required by law or for legitimate business purposes.
          </p>

          <h2>5. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and other tracking technologies to help us improve our services and your experience, see which areas and features of our services are popular, and count visits. For more information about cookies, and how to disable them, please see our Cookie Policy (if applicable) or your browser settings.
          </p>
          
          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href={`mailto:${siteSettings.contactEmail}`}>{siteSettings.contactEmail}</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
