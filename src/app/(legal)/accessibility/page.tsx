import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Accessibility Statement for Stone & Co. Solicitors. Learn about our commitment to making our website accessible to everyone.",
};

export default function AccessibilityPage() {
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
            Accessibility Statement
          </h1>
          <p className="text-neutral-400">Last updated: February 2025</p>
        </Container>
      </section>

      {/* Content */}
      <Section variant="default" padding="lg">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-lg prose-neutral">
            <h2>Our Commitment</h2>
            <p>
              Stone & Co. Solicitors is committed to ensuring digital
              accessibility for people with disabilities. We are continually
              improving the user experience for everyone and applying the
              relevant accessibility standards.
            </p>

            <h2>Conformance Status</h2>
            <p>
              We aim to conform to the Web Content Accessibility Guidelines
              (WCAG) 2.1 Level AA. These guidelines explain how to make web
              content more accessible for people with disabilities and more
              user-friendly for everyone.
            </p>

            <h2>Accessibility Features</h2>
            <p>
              We have implemented the following accessibility features on our
              website:
            </p>

            <h3>Navigation and Structure</h3>
            <ul>
              <li>
                Clear and consistent navigation throughout the website
              </li>
              <li>
                Descriptive page titles and headings
              </li>
              <li>
                Skip to main content link for keyboard users
              </li>
              <li>
                Breadcrumb navigation where appropriate
              </li>
            </ul>

            <h3>Visual Design</h3>
            <ul>
              <li>
                Sufficient colour contrast ratios between text and backgrounds
              </li>
              <li>
                Text can be resized up to 200% without loss of functionality
              </li>
              <li>
                No content relies solely on colour to convey information
              </li>
              <li>
                Responsive design that works across different screen sizes
              </li>
            </ul>

            <h3>Content</h3>
            <ul>
              <li>
                Alternative text for images and meaningful graphics
              </li>
              <li>
                Clear and simple language where possible
              </li>
              <li>
                Links that make sense out of context
              </li>
              <li>
                Form labels and error messages
              </li>
            </ul>

            <h3>Keyboard Accessibility</h3>
            <ul>
              <li>
                All interactive elements are keyboard accessible
              </li>
              <li>
                Visible focus indicators on interactive elements
              </li>
              <li>
                No keyboard traps
              </li>
            </ul>

            <h2>Assistive Technology Compatibility</h2>
            <p>Our website is designed to be compatible with:</p>
            <ul>
              <li>Screen readers (such as JAWS, NVDA, and VoiceOver)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>

            <h2>Known Limitations</h2>
            <p>
              While we strive for accessibility, some areas of our website may
              have limitations:
            </p>
            <ul>
              <li>
                Some older PDF documents may not be fully accessible. We are
                working to update these.
              </li>
              <li>
                Some third-party content may not meet our accessibility
                standards.
              </li>
            </ul>
            <p>
              We are actively working to address these limitations and improve
              accessibility across our website.
            </p>

            <h2>Alternative Formats</h2>
            <p>
              If you require information from our website in an alternative
              format, please contact us. We can provide information in:
            </p>
            <ul>
              <li>Large print</li>
              <li>Audio format</li>
              <li>Accessible electronic formats</li>
            </ul>

            <h2>Physical Accessibility</h2>
            <p>
              Both our City and Leytonstone offices are accessible for
              wheelchair users. If you have specific accessibility requirements,
              please let us know before your visit so we can make appropriate
              arrangements.
            </p>

            <h2>Feedback and Contact</h2>
            <p>
              We welcome your feedback on the accessibility of our website. If
              you experience any accessibility barriers or have suggestions for
              improvement, please contact us:
            </p>
            <p>
              Email:{" "}
              <a href="mailto:accessibility@stonelegal.co.uk">
                accessibility@stonelegal.co.uk
              </a>
              <br />
              Phone: 020 7118 0530
            </p>
            <p>
              When contacting us, please provide:
            </p>
            <ul>
              <li>The web address (URL) of the page</li>
              <li>A description of the problem</li>
              <li>
                The assistive technology you are using (if applicable)
              </li>
            </ul>
            <p>
              We will respond to your feedback within 5 working days and work to
              resolve any issues as quickly as possible.
            </p>

            <h2>Enforcement Procedure</h2>
            <p>
              If you are not satisfied with our response to your accessibility
              concern, you can contact the Equality Advisory Support Service
              (EASS) at{" "}
              <a
                href="https://www.equalityadvisoryservice.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                equalityadvisoryservice.com
              </a>
              .
            </p>

            <h2>Continuous Improvement</h2>
            <p>
              We are committed to continually improving the accessibility of our
              website. This statement will be reviewed and updated regularly as
              we make improvements.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
