import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Stone & Co. Solicitors. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-neutral-900 pt-24 pb-12 md:pt-32 md:pb-16">
        <Container>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-neutral-400">Last updated: February 2025</p>
        </Container>
      </section>

      {/* Content */}
      <Section variant="default" padding="lg">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-lg prose-neutral">
            <h2>Introduction</h2>
            <p>
              Stone & Co. Solicitors (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              visit our website stonelegal.co.uk or use our legal services.
            </p>
            <p>
              We are registered with the Information Commissioner&apos;s Office (ICO)
              and comply with the UK General Data Protection Regulation (UK
              GDPR) and the Data Protection Act 2018.
            </p>

            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you provide to us, including:</p>
            <ul>
              <li>Name, email address, telephone number, and postal address</li>
              <li>Information relevant to your legal matter</li>
              <li>Payment information for billing purposes</li>
              <li>
                Communications with us, including emails and phone calls
              </li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect:</p>
            <ul>
              <li>IP address and browser type</li>
              <li>Pages visited and time spent on our website</li>
              <li>Referring website information</li>
              <li>Device and operating system information</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul>
              <li>Provide legal services to you</li>
              <li>Communicate with you about your matter</li>
              <li>Process payments and maintain records</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Improve our website and services</li>
              <li>
                Send marketing communications (where you have consented)
              </li>
            </ul>

            <h2>Legal Basis for Processing</h2>
            <p>We process your personal information based on:</p>
            <ul>
              <li>
                <strong>Contract:</strong> To perform our legal services for you
              </li>
              <li>
                <strong>Legal obligation:</strong> To comply with our regulatory
                duties as solicitors
              </li>
              <li>
                <strong>Legitimate interests:</strong> To operate our business
                and improve our services
              </li>
              <li>
                <strong>Consent:</strong> For marketing communications
              </li>
            </ul>

            <h2>Data Sharing</h2>
            <p>
              We may share your information with third parties only when
              necessary:
            </p>
            <ul>
              <li>Courts, tribunals, and other legal bodies</li>
              <li>Regulatory bodies (such as the SRA)</li>
              <li>
                Other professionals involved in your matter (with your consent)
              </li>
              <li>IT service providers who support our systems</li>
              <li>Payment processors</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to
              protect your personal information, including:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure access controls and authentication</li>
              <li>Regular security assessments</li>
              <li>Staff training on data protection</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to
              fulfil the purposes for which it was collected, including
              satisfying legal, regulatory, and professional obligations. For
              legal matters, we typically retain files for a minimum of 6 years
              after the matter concludes, or longer where required.
            </p>

            <h2>Your Rights</h2>
            <p>Under data protection law, you have rights including:</p>
            <ul>
              <li>
                <strong>Right of access:</strong> Request a copy of your
                personal information
              </li>
              <li>
                <strong>Right to rectification:</strong> Request correction of
                inaccurate information
              </li>
              <li>
                <strong>Right to erasure:</strong> Request deletion of your
                information (subject to legal obligations)
              </li>
              <li>
                <strong>Right to restrict processing:</strong> Request
                limitation of how we use your information
              </li>
              <li>
                <strong>Right to data portability:</strong> Request transfer of
                your information
              </li>
              <li>
                <strong>Right to object:</strong> Object to processing based on
                legitimate interests
              </li>
              <li>
                <strong>Right to withdraw consent:</strong> Withdraw consent for
                marketing communications
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us using the details
              below.
            </p>

            <h2>Cookies</h2>
            <p>
              Our website uses cookies to improve your browsing experience.
              Please see our Cookie Policy for more information about the
              cookies we use and how to manage your preferences.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new Privacy
              Policy on this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <p>
              Stone & Co. Solicitors
              <br />
              Email:{" "}
              <a href="mailto:privacy@stonelegal.co.uk">
                privacy@stonelegal.co.uk
              </a>
              <br />
              Phone: 020 7118 0530
            </p>
            <p>
              If you are not satisfied with our response, you have the right to
              lodge a complaint with the Information Commissioner&apos;s Office (ICO)
              at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
              >
                ico.org.uk
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
