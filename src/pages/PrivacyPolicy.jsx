import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we collect, use, and protect
            your information.
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
                1. Information We Collect
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Personal Information
                </h3>
                <p>When you create an account, we collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name and email address</li>
                  <li>Profile information (age, weight, fitness goals)</li>
                  <li>Authentication credentials</li>
                  <li>Payment information (processed securely by Stripe)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6">
                  Activity Data
                </h3>
                <p>When you use our fitness tracking features, we collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>GPS location data and routes</li>
                  <li>Exercise duration, distance, and speed</li>
                  <li>Heart rate and other biometric data (if provided)</li>
                  <li>Workout preferences and goals</li>
                  <li>Photos and notes you add to activities</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6">
                  Technical Information
                </h3>
                <p>We automatically collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Device information (type, operating system, browser)</li>
                  <li>IP address and approximate location</li>
                  <li>Usage patterns and app interactions</li>
                  <li>Crash reports and performance data</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                2. How We Use Your Information
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Core Service Functions
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide GPS tracking and route mapping</li>
                  <li>Generate fitness analytics and progress reports</li>
                  <li>Enable goal setting and achievement tracking</li>
                  <li>Facilitate social features and community interactions</li>
                  <li>Process payments and manage subscriptions</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6">
                  Service Improvement
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Analyze usage patterns to improve our platform</li>
                  <li>Develop new features based on user behavior</li>
                  <li>Troubleshoot technical issues and bugs</li>
                  <li>Conduct research and analytics</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6">
                  Communication
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Send account-related notifications</li>
                  <li>Provide customer support</li>
                  <li>Share important service updates</li>
                  <li>Send promotional content (with your consent)</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                3. Information Sharing and Disclosure
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                  <p className="font-semibold text-green-300 mb-2">
                    🔒 Your Privacy is Protected
                  </p>
                  <p>
                    We do not sell, trade, or rent your personal information to
                    third parties for marketing purposes.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-white">
                  We may share your information only in these circumstances:
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>With your consent:</strong> When you explicitly
                    agree to share data
                  </li>
                  <li>
                    <strong>Service providers:</strong> Trusted partners who
                    help us operate (hosting, analytics, payment processing)
                  </li>
                  <li>
                    <strong>Legal requirements:</strong> When required by law or
                    to protect rights and safety
                  </li>
                  <li>
                    <strong>Business transfers:</strong> In the event of a
                    merger, acquisition, or sale of assets
                  </li>
                  <li>
                    <strong>Emergency situations:</strong> To prevent harm to
                    you or others
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6">
                  Social Features
                </h3>
                <p>
                  When you use social features, certain information may be
                  visible to other users based on your privacy settings:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Public activities and achievements</li>
                  <li>Profile information you choose to share</li>
                  <li>Comments and interactions in community features</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                4. Data Security and Protection
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <p>
                  We implement industry-standard security measures to protect
                  your information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Encryption:</strong> Data is encrypted in transit
                    and at rest
                  </li>
                  <li>
                    <strong>Access controls:</strong> Limited employee access on
                    a need-to-know basis
                  </li>
                  <li>
                    <strong>Regular audits:</strong> Security reviews and
                    vulnerability assessments
                  </li>
                  <li>
                    <strong>Secure infrastructure:</strong> Protected servers
                    and network security
                  </li>
                  <li>
                    <strong>Payment security:</strong> PCI-compliant payment
                    processing through Stripe
                  </li>
                </ul>

                <div className="bg-amber-900/20 border border-amber-800 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-amber-300 mb-2">
                    ⚠️ Important Note
                  </p>
                  <p>
                    While we implement strong security measures, no method of
                    transmission over the internet is 100% secure. We cannot
                    guarantee absolute security of your information.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                5. Your Privacy Rights and Choices
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  You have the right to:
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal
                    data
                  </li>
                  <li>
                    <strong>Correct:</strong> Update or correct inaccurate
                    information
                  </li>
                  <li>
                    <strong>Delete:</strong> Request deletion of your personal
                    data
                  </li>
                  <li>
                    <strong>Port:</strong> Export your data in a portable format
                  </li>
                  <li>
                    <strong>Restrict:</strong> Limit how we process your
                    information
                  </li>
                  <li>
                    <strong>Object:</strong> Opt out of certain data processing
                    activities
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6">
                  Privacy Controls
                </h3>
                <p>
                  You can manage your privacy settings through your account:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Control what information is public or private</li>
                  <li>Manage location sharing preferences</li>
                  <li>Opt in or out of promotional communications</li>
                  <li>Set data retention preferences</li>
                  <li>Download your data at any time</li>
                </ul>

                <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-blue-300 mb-2">
                    📧 Contact Us
                  </p>
                  <p>
                    To exercise your privacy rights, contact us at
                    privacy@waypoint.com or through your account settings.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                6. Location Data and GPS Tracking
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <p>
                  Location data is essential to our core fitness tracking
                  features. Here&apos;s how we handle it:
                </p>

                <h3 className="text-xl font-semibold text-white">
                  Collection and Use
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    GPS coordinates are collected only during active workout
                    sessions
                  </li>
                  <li>
                    Location data is used to map routes and calculate distances
                  </li>
                  <li>
                    Precise location is stored locally and backed up securely
                  </li>
                  <li>
                    General location may be used for weather and local
                    recommendations
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6">
                  Your Control
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    You can disable location services at any time in device
                    settings
                  </li>
                  <li>Previous routes can be made private or deleted</li>
                  <li>You control which activities include location data</li>
                  <li>Location sharing with friends is always optional</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                7. Cookies and Tracking Technologies
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Types of Cookies We Use
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Essential cookies:</strong> Required for basic site
                    functionality
                  </li>
                  <li>
                    <strong>Analytics cookies:</strong> Help us understand how
                    you use our service
                  </li>
                  <li>
                    <strong>Preference cookies:</strong> Remember your settings
                    and preferences
                  </li>
                  <li>
                    <strong>Security cookies:</strong> Help protect against
                    fraud and abuse
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6">
                  Third-Party Services
                </h3>
                <p>
                  We use trusted third-party services that may set their own
                  cookies:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Google Analytics for usage insights</li>
                  <li>Stripe for payment processing</li>
                  <li>Authentication providers (Google, Microsoft)</li>
                </ul>

                <p className="mt-4">
                  You can control cookies through your browser settings. Note
                  that disabling certain cookies may affect site functionality.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                8. Data Retention and Deletion
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  How Long We Keep Your Data
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Account data:</strong> Retained while your account
                    is active
                  </li>
                  <li>
                    <strong>Activity data:</strong> Kept indefinitely unless you
                    delete it
                  </li>
                  <li>
                    <strong>Technical logs:</strong> Typically deleted after 2
                    years
                  </li>
                  <li>
                    <strong>Payment records:</strong> Retained as required by
                    law (usually 7 years)
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6">
                  Account Deletion
                </h3>
                <p>When you delete your account:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Personal information is deleted within 30 days</li>
                  <li>Activity data is permanently removed</li>
                  <li>
                    Some information may be retained for legal or security
                    purposes
                  </li>
                  <li>
                    Anonymized data may be kept for research and analytics
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                9. International Data Transfers
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <p>
                  Waypoint operates globally, and your information may be
                  transferred to and processed in countries outside your country
                  of residence, including the United States.
                </p>
                <p>
                  We ensure appropriate safeguards are in place for
                  international transfers, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Standard contractual clauses approved by regulatory
                    authorities
                  </li>
                  <li>
                    Adequacy decisions by relevant data protection authorities
                  </li>
                  <li>Certified transfer mechanisms where available</li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                10. Children&apos;s Privacy
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <p>
                  Waypoint is not intended for children under 13 years of age.
                  We do not knowingly collect personal information from children
                  under 13.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has
                  provided us with personal information, please contact us
                  immediately. We will take steps to remove such information
                  from our systems.
                </p>
                <p>
                  For users between 13 and 18, we recommend parental guidance
                  when using our service, especially regarding location sharing
                  and social features.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                11. Changes to This Privacy Policy
              </h2>
              <div className="text-neutral-300 leading-relaxed space-y-4">
                <p>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices or for legal and regulatory reasons.
                </p>
                <p>We will notify you of material changes by:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Email notification (if you have provided an email address)
                  </li>
                  <li>In-app notification</li>
                  <li>Posting a notice on our website</li>
                  <li>
                    Updating the &quot;Last Updated&quot; date at the top of
                    this policy
                  </li>
                </ul>
                <p>
                  We encourage you to review this Privacy Policy periodically to
                  stay informed about how we protect your information.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 text-white">
                12. Contact Us
              </h2>
              <div className="text-neutral-300 leading-relaxed">
                <p className="mb-4">
                  If you have questions, concerns, or requests regarding this
                  Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-neutral-800 rounded-lg p-4 space-y-2">
                  <p>
                    <strong>Privacy Team:</strong> privacy@waypoint.com
                  </p>
                  <p>
                    <strong>Data Protection Officer:</strong> dpo@waypoint.com
                  </p>
                  <p>
                    <strong>Mailing Address:</strong>
                  </p>
                  <p className="ml-4">
                    Waypoint Inc.
                    <br />
                    Attn: Privacy Team
                    <br />
                    123 Fitness Ave
                    <br />
                    San Francisco, CA 94102
                    <br />
                    United States
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-MOVE
                  </p>
                </div>
                <p className="mt-4 text-sm text-neutral-400">
                  We aim to respond to all privacy inquiries within 30 days.
                </p>
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

export default PrivacyPolicy;
