import LegalPage, { Review } from '@/components/site/LegalPage';
import { site } from '@/config/site';

// Draft: noindex and left out of the sitemap until the content is approved.
export const metadata = {
  title: 'Privacy policy',
  description: `How ${site.name} collects, uses and protects personal data on ${site.url.replace('https://', '')}.`,
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="Draft, October 2026" draft>
      <p>
        This site is run by {site.fullName}, an independent consultant based in {site.location} (“I”, “me”). This policy explains what personal data
        the site collects, why, and what you can ask me to do with it. Questions go to <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>What I collect</h2>
      <ul>
        <li>
          <strong>Enquiry form.</strong> When you book a discovery call: first and last name, email, company, country, phone number with country code,
          how you heard about me, and any note you add.
        </li>
        <li>
          <strong>Call booking.</strong> The calendar is provided by Calendly. Your name and email are passed to it so you do not type them twice. Calendly
          handles the booking under its own privacy policy.
        </li>
        <li>
          <strong>AI Visibility Checker.</strong> The brand name and question you enter, the answer the AI model returns, and your IP address. The IP address
          is used to limit abuse of the tool.
        </li>
        <li>
          <strong>Calculators.</strong> They run in your browser and your inputs are not sent to me. Your currency choice is remembered in your browser’s
          local storage.
        </li>
        <li>
          <strong>Technical logs.</strong> Like any website, the servers and the network in front of them record IP addresses, browser details and requested
          pages for security and reliability.
        </li>
      </ul>
      <p>The site does not use advertising or analytics cookies.</p>

      <h2>How I use it</h2>
      <ul>
        <li>To reply to your enquiry, schedule a call and prepare for it.</li>
        <li>
          To prioritise enquiries. Each enquiry is automatically classified by an AI model (likely fit, service of interest, industry, and whether it looks
          like spam). I read every enquiry myself; the classification does not decide anything on its own.
        </li>
        <li>To run the free tools and keep them available.</li>
      </ul>
      <p>I do not sell personal data or use it for advertising.</p>

      <h2>Who processes it for me</h2>
      <ul>
        <li>Hosting and database providers that store enquiries and tool results.</li>
        <li>Google (Gemini), reached through an AI integration service, for the visibility checker and enquiry classification.</li>
        <li>Calendly, for call booking.</li>
        <li>Cloudflare, which sits in front of the site for security and performance.</li>
      </ul>
      <Review>confirm the hosting, database and AI providers by name, and where they store data, once the hosting decision is made.</Review>

      <h2>How long I keep it</h2>
      <p>Enquiries are kept while we are in touch and for up to 24 months after the last contact. AI Visibility Checker results are kept for up to 12 months.</p>
      <Review>these retention periods are proposals; the code does not delete anything automatically yet.</Review>

      <h2>Your rights</h2>
      <p>
        You can ask to see the personal data I hold about you, correct it, delete it, or withdraw consent to my using it. Email{' '}
        <a href={`mailto:${site.email}`}>{site.email}</a> and I will reply within 30 days. These rights apply under India’s Digital Personal Data Protection
        Act, 2023, and equivalent rights apply if you are in the EU or UK.
      </p>
      <Review>confirm the grievance contact and response time required under the DPDP Act and its rules.</Review>

      <h2>Changes</h2>
      <p>If this policy changes, the updated version will be posted on this page with a new date.</p>
    </LegalPage>
  );
}
