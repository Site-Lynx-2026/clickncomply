import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ClickNComply",
  description:
    "How ClickNComply collects, uses, and protects your data under UK GDPR.",
};

const LAST_UPDATED = "27 April 2026";

export default function PrivacyPage() {
  return (
    <article className="prose-cnc">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Last updated: {LAST_UPDATED}
      </p>

      <h2>1. Who we are</h2>
      <p>
        ClickNComply is operated by <strong>Site Lynx Group Ltd</strong>, a
        company registered in England and Wales. We are the data controller for
        the personal data we hold about you. You can contact us at{" "}
        <a href="mailto:hello@clickncomply.co.uk">hello@clickncomply.co.uk</a>.
      </p>

      <h2>2. What we collect</h2>
      <p>When you use ClickNComply we collect:</p>
      <ul>
        <li>
          <strong>Account data</strong> — your name, email address, and an
          encrypted password hash.
        </li>
        <li>
          <strong>Organisation data</strong> — your company name, industry,
          team size, optional logo, and the projects and clients you add.
        </li>
        <li>
          <strong>Document content</strong> — the text, selections, and
          metadata of every RAMs, method statement, risk assessment, COSHH
          assessment and other document you create.
        </li>
        <li>
          <strong>AI inputs</strong> — the prompts and form data sent to our
          AI sub-processor (Anthropic) when you use AI-assist features.
        </li>
        <li>
          <strong>Operational logs</strong> — IP address, browser type, request
          timestamps and error reports, retained for security and debugging.
        </li>
        <li>
          <strong>Payment metadata</strong> — handled by Stripe; we never see
          full card numbers.
        </li>
      </ul>

      <h2>3. Why we collect it (lawful basis)</h2>
      <p>
        We process your data on the basis of the <strong>contract</strong>{" "}
        between you and us (delivering the service you signed up for) and our{" "}
        <strong>legitimate interests</strong> (running the platform, preventing
        abuse, debugging issues). We do not process special-category data and
        do not run profiling or automated decision-making with legal effect.
      </p>

      <h2>4. AI-generated content</h2>
      <p>
        ClickNComply uses Anthropic&apos;s Claude (Haiku) models to generate
        draft text. When you use an AI-assist feature, the relevant form data
        is sent to Anthropic&apos;s API. Anthropic does not retain your data
        for training purposes under our agreement with them. All AI outputs are
        labelled &ldquo;AI-generated draft &middot; review before
        delivery&rdquo; on the document footer.
      </p>

      <h2>5. Sub-processors</h2>
      <p>The following third-party services process data on our behalf:</p>
      <ul>
        <li>
          <strong>Supabase</strong> — authentication, database, file storage
          (EU and US regions, transferred under the UK IDTA / SCCs)
        </li>
        <li>
          <strong>Vercel</strong> — hosting and serverless compute (US
          infrastructure, transferred under the UK IDTA / SCCs)
        </li>
        <li>
          <strong>Anthropic</strong> — AI text generation (US, transferred
          under the UK IDTA / SCCs)
        </li>
        <li>
          <strong>Stripe</strong> — payments (US/UK)
        </li>
        <li>
          <strong>Resend</strong> — transactional email delivery (US,
          transferred under the UK IDTA / SCCs)
        </li>
      </ul>
      <p>
        We post material changes to this list at least 30 days before they
        take effect.
      </p>

      <h2>6. International transfers</h2>
      <p>
        Some of our sub-processors are based outside the UK and EEA. Where
        this is the case, we rely on the UK International Data Transfer
        Agreement (IDTA), the EU Standard Contractual Clauses (SCCs), or
        equivalent UK-approved mechanisms.
      </p>

      <h2>7. How long we keep your data</h2>
      <ul>
        <li>
          <strong>Active account</strong> — for the duration of your
          subscription and any required statutory retention period after.
        </li>
        <li>
          <strong>Deleted account</strong> — your profile name and avatar are
          scrubbed immediately when you delete your account from the{" "}
          <a href="/account">Account</a> page. Authentication records are
          removed from Supabase Auth in the same operation.
        </li>
        <li>
          <strong>Document content</strong> — documents you authored may
          remain with the organisation you created them for if you leave that
          organisation. Email{" "}
          <a href="mailto:hello@clickncomply.co.uk">
            hello@clickncomply.co.uk
          </a>{" "}
          for full erasure.
        </li>
        <li>
          <strong>Payment and tax records</strong> — retained for the period
          required by HMRC and tax authorities (typically six years).
        </li>
      </ul>

      <h2>8. Your rights</h2>
      <p>Under UK GDPR and the Data Protection Act 2018 you have the right to:</p>
      <ul>
        <li>access the personal data we hold about you</li>
        <li>have inaccurate data corrected</li>
        <li>have your data erased (right to be forgotten)</li>
        <li>restrict or object to certain processing</li>
        <li>data portability (a copy of your data in a portable format)</li>
        <li>
          complain to the UK Information Commissioner&apos;s Office (ICO) at{" "}
          <a
            href="https://ico.org.uk/concerns/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ico.org.uk/concerns
          </a>
        </li>
      </ul>
      <p>
        Most rights can be exercised directly from the{" "}
        <a href="/account">Account</a> page. For anything not available
        in-app, email <a href="mailto:hello@clickncomply.co.uk">
          hello@clickncomply.co.uk
        </a>{" "}
        and we will respond within one calendar month.
      </p>

      <h2>9. Cookies</h2>
      <p>
        We use only the cookies necessary for the service to function
        (authentication session and CSRF protection). We do not use
        analytics cookies or marketing cookies. If we add either in the
        future we will publish a cookie banner before doing so.
      </p>

      <h2>10. Security</h2>
      <p>
        We use industry-standard encryption in transit (TLS 1.2+) and at
        rest. Passwords are hashed by Supabase using bcrypt. Row-level
        security policies prevent cross-organisation data access. We rate-limit
        sensitive endpoints to prevent abuse.
      </p>

      <h2>11. Children</h2>
      <p>
        ClickNComply is a B2B service intended for adults working in
        construction and related industries. We do not knowingly collect
        personal data from children under 16.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. Material changes
        (new sub-processors, expanded data collection, changes to retention
        periods) will be notified to active users by email at least 30 days
        before the change takes effect.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions, requests or complaints:{" "}
        <a href="mailto:hello@clickncomply.co.uk">
          hello@clickncomply.co.uk
        </a>
      </p>
    </article>
  );
}
