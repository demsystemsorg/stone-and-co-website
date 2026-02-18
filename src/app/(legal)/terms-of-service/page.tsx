import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Stone & Co. Solicitors website. Please read these terms carefully before using our website.",
};

export default function TermsOfServicePage() {
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
            Terms of Service
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
              Welcome to Stone & Co. Solicitors. These Terms of Service
              (&quot;Terms&quot;) govern your use of our website at stonelegal.co.uk
              (&quot;Website&quot;). By accessing or using our Website, you agree to be
              bound by these Terms.
            </p>

            <h2>About Us</h2>
            <p>
              Stone & Co. Solicitors is a law firm regulated by the Solicitors
              Regulation Authority (SRA). Our SRA number is [SRA Number]. We are
              registered in England and Wales.
            </p>

            <h2>Website Use</h2>
            <h3>Permitted Use</h3>
            <p>You may use our Website for lawful purposes only. You must not:</p>
            <ul>
              <li>Use the Website in any way that breaches applicable laws</li>
              <li>
                Use the Website to transmit harmful, threatening, or offensive
                material
              </li>
              <li>
                Attempt to gain unauthorised access to our systems or data
              </li>
              <li>
                Use automated systems to extract data from the Website
              </li>
              <li>
                Interfere with the proper working of the Website
              </li>
            </ul>

            <h3>Intellectual Property</h3>
            <p>
              All content on this Website, including text, graphics, logos, and
              images, is the property of Stone & Co. Solicitors or our licensors
              and is protected by copyright and other intellectual property
              laws. You may not reproduce, distribute, or create derivative
              works without our prior written consent.
            </p>

            <h2>Information on Our Website</h2>
            <h3>General Information Only</h3>
            <p>
              The information provided on this Website is for general
              informational purposes only. It does not constitute legal advice
              and should not be relied upon as such. The information may not be
              accurate, complete, or current.
            </p>

            <h3>No Solicitor-Client Relationship</h3>
            <p>
              Using this Website or contacting us through it does not create a
              solicitor-client relationship. Such a relationship is only formed
              when we have formally agreed to act for you and you have received
              our written terms of engagement.
            </p>

            <h2>Contact Form and Enquiries</h2>
            <p>
              When you submit an enquiry through our Website, we will handle
              your information in accordance with our Privacy Policy. While we
              endeavour to respond to all enquiries promptly, we cannot
              guarantee response times and submitting an enquiry does not
              obligate us to provide legal services.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              Our Website may contain links to third-party websites. These links
              are provided for your convenience only. We do not endorse or
              control these websites and are not responsible for their content
              or privacy practices.
            </p>

            <h2>Limitation of Liability</h2>
            <p>To the fullest extent permitted by law:</p>
            <ul>
              <li>
                We provide this Website on an &quot;as is&quot; and &quot;as available&quot; basis
              </li>
              <li>
                We make no warranties, express or implied, regarding the Website
                or its content
              </li>
              <li>
                We shall not be liable for any direct, indirect, incidental, or
                consequential damages arising from your use of the Website
              </li>
              <li>
                Our total liability shall not exceed £100
              </li>
            </ul>
            <p>
              Nothing in these Terms limits or excludes our liability for death
              or personal injury caused by our negligence, fraud, or any other
              liability that cannot be limited by law.
            </p>

            <h2>Professional Liability</h2>
            <p>
              Our professional liability as solicitors is governed by our terms
              of engagement, which we provide when you instruct us. We maintain
              professional indemnity insurance as required by the SRA.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of England and Wales. Any disputes arising from these Terms
              or your use of the Website shall be subject to the exclusive
              jurisdiction of the courts of England and Wales.
            </p>

            <h2>Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will post any
              changes on this page and update the &quot;Last updated&quot; date.
              Continued use of the Website after changes constitutes acceptance
              of the new Terms.
            </p>

            <h2>Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid or
              unenforceable, the remaining provisions shall continue in full
              force and effect.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <p>
              Stone & Co. Solicitors
              <br />
              Email:{" "}
              <a href="mailto:info@stonelegal.co.uk">info@stonelegal.co.uk</a>
              <br />
              Phone: 020 XXXX XXXX
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
