import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — ClickNComply",
  description:
    "The terms governing your use of ClickNComply.",
};

const LAST_UPDATED = "27 April 2026";

export default function TermsPage() {
  return (
    <article className="prose-cnc">
      <h1>Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Last updated: {LAST_UPDATED}
      </p>

      <h2>1. About these terms</h2>
      <p>
        These terms govern your use of ClickNComply, a software-as-a-service
        platform operated by <strong>Site Lynx Group Ltd</strong>, a company
        registered in England and Wales (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
        &ldquo;our&rdquo;). By creating an account or using the service you
        agree to these terms.
      </p>

      <h2>2. The service</h2>
      <p>
        ClickNComply provides templates, AI-assisted drafting, and document
        management tools to help businesses produce health and safety, quality,
        environmental and compliance documents (&ldquo;the service&rdquo;).
        Access is provided on a per-user subscription basis.
      </p>
      <p>
        Documents generated through the service are{" "}
        <strong>aligned with</strong> the standards they reference (for
        example, BS EN 1090, ISO 9001, BS 7121, CDM 2015) but they are not a
        substitute for professional judgement, qualified competent persons,
        or formal certification by an accredited body.{" "}
        <strong>
          You are responsible for reviewing every document and confirming it
          is fit for the specific job, site, and people it covers before
          delivery.
        </strong>
      </p>

      <h2>3. Your account</h2>
      <ul>
        <li>You must be at least 18 to create an account.</li>
        <li>One person per account; do not share login credentials.</li>
        <li>
          You are responsible for keeping your password secure and for all
          activity under your account.
        </li>
        <li>
          The information you provide (name, email, company details) must be
          accurate and kept up to date.
        </li>
      </ul>

      <h2>4. Subscriptions, trials, billing</h2>
      <ul>
        <li>
          New accounts include a <strong>5-day free Pro trial</strong>. No
          payment method is required to start the trial.
        </li>
        <li>
          After the trial expires, account access continues on a free tier.
          Generated PDFs revert to a watermarked output and certain Pro
          features become unavailable until you upgrade.
        </li>
        <li>
          Pro subscriptions are <strong>£2 per user per month</strong>{" "}
          (or the equivalent annual price as advertised at signup).
        </li>
        <li>
          Subscriptions auto-renew at the end of each billing period. You can
          cancel at any time from the Account page; cancellation takes effect
          at the end of the current paid period.
        </li>
        <li>
          We do not refund unused portions of a billing period. If you cancel
          mid-period you retain access until the period ends.
        </li>
        <li>
          We may change pricing on future renewals with at least 30 days&apos;
          notice by email. Changes do not affect the current paid period.
        </li>
        <li>
          Payments are processed by Stripe. We never see or store full card
          numbers.
        </li>
      </ul>

      <h2>5. Acceptable use</h2>
      <p>You agree not to use ClickNComply to:</p>
      <ul>
        <li>break the law in any jurisdiction</li>
        <li>upload or generate content that is unlawful, defamatory, or
          infringes third-party rights</li>
        <li>attempt to reverse-engineer, scrape, or interfere with the
          service</li>
        <li>circumvent rate limits, billing, or access controls</li>
        <li>use the service to spam, phish, or distribute malware</li>
        <li>resell access to the service without our written agreement</li>
      </ul>
      <p>
        We may suspend or terminate accounts that breach this section without
        refund.
      </p>

      <h2>6. AI-generated content</h2>
      <p>
        Some features of ClickNComply produce text using artificial
        intelligence. AI outputs are <strong>drafts</strong> and may contain
        errors, omissions or inaccuracies. Every AI-generated document is
        labelled accordingly. You must review every output before relying on
        it, distributing it, or presenting it as your own work.
      </p>
      <p>
        You retain ownership of your inputs and outputs. We claim no copyright
        in the documents you generate.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        The ClickNComply platform, software, templates, libraries, brand
        assets, and supporting content are owned by us or our licensors. You
        get a non-exclusive, non-transferable licence to use the service for
        your own business purposes for as long as your subscription is active.
      </p>
      <p>
        Documents you create using the service are yours. We do not claim
        ownership of your content; we may store and process it solely to
        deliver the service.
      </p>

      <h2>8. Liability</h2>
      <p>
        We provide the service on an &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; basis. To the maximum extent permitted by law, we
        exclude all implied warranties.
      </p>
      <p>
        Our aggregate liability to you for any claim arising out of or in
        connection with the service is limited to the greater of (a){" "}
        <strong>£100</strong> or (b) the total fees you paid us in the{" "}
        <strong>twelve months</strong> before the claim arose.
      </p>
      <p>
        We are not liable for indirect or consequential losses (including loss
        of profit, loss of business, loss of data, or loss of goodwill) however
        arising. Nothing in these terms limits liability for death or personal
        injury caused by negligence, fraud, or any other liability that cannot
        be excluded under English law.
      </p>

      <h2>9. Indemnity</h2>
      <p>
        You agree to indemnify us against claims arising from your use of the
        service in breach of these terms or applicable law, including claims
        from third parties who suffered loss because of a document you
        generated and delivered.
      </p>

      <h2>10. Service changes</h2>
      <p>
        We may add, remove, or change features of the service. Where a change
        materially reduces the value of your subscription, we will give you
        30 days&apos; notice and a pro-rata refund for the unused portion of
        any pre-paid period if you cancel within 14 days of the change.
      </p>

      <h2>11. Termination</h2>
      <p>
        You can cancel and delete your account at any time from the Account
        page. We may terminate accounts for breach of these terms, non-payment,
        or fraudulent activity. On termination your access ends; document
        export is available before termination from the Documents page.
      </p>

      <h2>12. Data protection</h2>
      <p>
        Our handling of your personal data is governed by our{" "}
        <a href="/privacy">Privacy Policy</a>, which forms part of these
        terms.
      </p>

      <h2>13. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Material changes will be
        notified to active users by email at least 30 days before they take
        effect. Continued use of the service after the change indicates
        acceptance.
      </p>

      <h2>14. Governing law and jurisdiction</h2>
      <p>
        These terms are governed by the laws of England and Wales. The courts
        of England and Wales have exclusive jurisdiction over any dispute
        arising out of or in connection with them.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions or issues:{" "}
        <a href="mailto:hello@clickncomply.co.uk">
          hello@clickncomply.co.uk
        </a>
      </p>
    </article>
  );
}
