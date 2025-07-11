import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function TermsOfUse() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-black text-white"
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Terms of Use
          </h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Please read these terms carefully before using Waypoint
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                1. Acceptance of Terms
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                By accessing and using Waypoint ("the Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use
                this service.
              </p>
              <p className="text-neutral-300 leading-relaxed mt-4">
                These Terms of Use may be updated from time to time without
                notice. Your continued use of the Service constitutes acceptance
                of those changes.
              </p>
            </section>

            {/* Section 2 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                2. Description of Service
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Waypoint is a fitness tracking platform that allows users to log
                outdoor activities including running, walking, and cycling. The
                Service provides GPS tracking, performance analytics, goal
                setting, and social features to help users monitor and improve
                their fitness activities.
              </p>
              <p className="text-neutral-300 leading-relaxed mt-4">
                We reserve the right to modify, suspend, or discontinue the
                Service at any time without notice. We shall not be liable to
                you or any third party for any modification, suspension, or
                discontinuance of the Service.
              </p>
            </section>

            {/* Section 3 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                3. User Accounts and Registration
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <p>
                  To access certain features of the Service, you must register
                  for an account. When you register, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>
                    Accept all risks of unauthorized access to your account
                  </li>
                  <li>
                    Notify us immediately of any unauthorized use of your
                    account
                  </li>
                </ul>
                <p>
                  You are responsible for all activities that occur under your
                  account. We reserve the right to refuse service, terminate
                  accounts, or cancel orders at our discretion.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                4. Acceptable Use Policy
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Upload, post, or transmit any content that is illegal,
                    harmful, threatening, abusive, or offensive
                  </li>
                  <li>
                    Impersonate any person or entity or falsely state your
                    affiliation with any person or entity
                  </li>
                  <li>
                    Upload, post, or transmit any unsolicited or unauthorized
                    advertising or promotional materials
                  </li>
                  <li>
                    Interfere with or disrupt the Service or servers connected
                    to the Service
                  </li>
                  <li>
                    Attempt to gain unauthorized access to any portion of the
                    Service
                  </li>
                  <li>
                    Use any automated means to access the Service for any
                    purpose without our express written permission
                  </li>
                  <li>
                    Share false or misleading fitness data that could endanger
                    other users
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                5. Health and Safety Disclaimer
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <p className="font-semibold text-red-300 mb-2">
                    ⚠️ Important Health Notice
                  </p>
                  <p>
                    Waypoint is not a medical device and should not be relied
                    upon for medical or health-related decisions. Always consult
                    with a healthcare professional before beginning any exercise
                    program.
                  </p>
                </div>
                <p>
                  You acknowledge that physical activity carries inherent risks
                  of injury. You assume all risks associated with your use of
                  the Service and participation in physical activities tracked
                  through the platform.
                </p>
                <p>
                  GPS and location tracking may not always be accurate. Do not
                  rely solely on Waypoint for navigation or emergency
                  situations.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                6. Privacy and Data Use
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Your privacy is important to us. Our collection and use of
                personal information is governed by our
                <Link
                  to="/privacy-policy"
                  className="text-blue-400 hover:text-blue-300 underline ml-1"
                >
                  Privacy Policy
                </Link>
                , which is incorporated into these Terms by reference.
              </p>
              <p className="text-neutral-300 leading-relaxed mt-4">
                By using the Service, you consent to the collection, use, and
                sharing of your information as described in our Privacy Policy.
              </p>
            </section>

            {/* Section 7 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                7. Intellectual Property Rights
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <p>
                  The Service and its original content, features, and
                  functionality are owned by Waypoint and are protected by
                  international copyright, trademark, patent, trade secret, and
                  other intellectual property laws.
                </p>
                <p>
                  You retain ownership of any content you submit to the Service.
                  By submitting content, you grant us a worldwide,
                  non-exclusive, royalty-free license to use, reproduce, modify,
                  and distribute your content in connection with the Service.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                8. Payment and Subscription Terms
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <p>
                  Certain features of the Service require payment of fees. You
                  agree to pay all applicable fees as described on the Service
                  at the time you choose to purchase or subscribe to premium
                  features.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Subscription fees are billed in advance on a recurring basis
                  </li>
                  <li>
                    You may cancel your subscription at any time through your
                    account settings
                  </li>
                  <li>
                    Cancellations take effect at the end of the current billing
                    period
                  </li>
                  <li>
                    We do not provide refunds for partial months of service
                  </li>
                  <li>
                    We reserve the right to change pricing with 30 days' notice
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                9. Limitation of Liability
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <p className="font-semibold uppercase text-sm tracking-wide">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <p>
                  IN NO EVENT SHALL WAYPOINT, ITS DIRECTORS, EMPLOYEES,
                  PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY
                  INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                  DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA,
                  USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR
                  USE OF THE SERVICE.
                </p>
                <p>
                  OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR
                  RELATING TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID
                  US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                10. Termination
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <p>
                  We may terminate or suspend your account and access to the
                  Service immediately, without prior notice or liability, for
                  any reason, including if you breach these Terms.
                </p>
                <p>
                  Upon termination, your right to use the Service will cease
                  immediately. The provisions of these Terms that by their
                  nature should survive termination shall survive, including
                  ownership provisions, warranty disclaimers, and limitations of
                  liability.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                11. Governing Law and Jurisdiction
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of the State of California, United States, without
                regard to its conflict of law provisions. Any disputes arising
                from these Terms or the Service shall be resolved in the courts
                located in San Francisco, California.
              </p>
            </section>

            {/* Section 12 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                12. Changes to Terms
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. If we
                make material changes, we will notify you by email (if you have
                provided one) or by posting a notice on the Service. Your
                continued use of the Service after such modifications
                constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Section 13 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                13. Contact Information
              </h2>
              <div className="text-neutral-300 leading-relaxed">
                <p className="mb-4">
                  If you have any questions about these Terms of Use, please
                  contact us:
                </p>
                <div className="bg-neutral-800 rounded-lg p-4 space-y-2">
                  <p>
                    <strong>Email:</strong> legal@waypoint.com
                  </p>
                  <p>
                    <strong>Address:</strong> Waypoint Inc., 123 Fitness Ave,
                    San Francisco, CA 94102
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-MOVE
                  </p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-neutral-800 text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            ← Back to Waypoint
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default TermsOfUse;
