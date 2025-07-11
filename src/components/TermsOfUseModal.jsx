function TermsOfUseModal() {
  return (
    <div className="space-y-6 text-gray-800">
      {/* Last updated */}
      <p className="text-xs text-gray-500 text-center">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {/* Section 1 */}
      <section className="space-y-3">
        <h3 className="text-base font-semibold" style={{ color: "#111827" }}>
          1. Acceptance of Terms
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          By accessing and using Waypoint, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          These Terms of Use may be updated from time to time without notice. Your continued use of the Service constitutes acceptance of those changes.
        </p>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <h3 className="text-base font-semibold" style={{ color: "#111827" }}>
          2. Description of Service
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Waypoint is a fitness tracking platform that allows users to log outdoor activities including running, walking, and cycling. The Service provides GPS tracking, performance analytics, goal setting, and social features to help users monitor and improve their fitness activities.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          We reserve the right to modify, suspend, or discontinue the Service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
        </p>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <h3 className="text-base font-semibold" style={{ color: "#111827" }}>
          3. User Accounts and Registration
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          To access certain features of the Service, you must register for an account. When you register, you agree to:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-3 text-sm text-gray-700">
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and promptly update your account information</li>
          <li>Maintain the security of your password and account</li>
          <li>Accept all risks of unauthorized access to your account</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
        </ul>
        <p className="text-sm text-gray-700 leading-relaxed">
          You are responsible for all activities that occur under your account. We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion.
        </p>
      </section>

      {/* Section 4 */}
      <section className="space-y-3">
        <h3 className="text-base font-semibold" style={{ color: "#111827" }}>
          4. Acceptable Use Policy
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">You agree not to use the Service to:</p>
        <ul className="list-disc list-inside space-y-1 ml-3 text-sm text-gray-700">
          <li>Upload, post, or transmit any content that is illegal, harmful, threatening, abusive, or offensive</li>
          <li>Impersonate any person or entity or falsely state your affiliation with any person or entity</li>
          <li>Upload, post, or transmit any unsolicited or unauthorized advertising or promotional materials</li>
          <li>Interfere with or disrupt the Service or servers connected to the Service</li>
          <li>Attempt to gain unauthorized access to any portion of the Service</li>
          <li>Use any automated means to access the Service for any purpose without our express written permission</li>
          <li>Share false or misleading fitness data that could endanger other users</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section className="space-y-3">
        <h3 className="text-base font-semibold" style={{ color: "#111827" }}>
          5. Health and Safety Disclaimer
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
          <p className="font-medium text-red-800 text-sm">
            ⚠️ Important Health Notice
          </p>
          <p className="text-red-700 text-sm">
            Waypoint is not a medical device and should not be relied upon for medical or health-related decisions. Always consult with a healthcare professional before beginning any exercise program.
          </p>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          You acknowledge that physical activity carries inherent risks of injury. You assume all risks associated with your use of the Service and participation in physical activities tracked through the platform.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          GPS and location tracking may not always be accurate. Do not rely solely on Waypoint for navigation or emergency situations.
        </p>
      </section>

      {/* Additional sections abbreviated for brevity */}
      <section className="space-y-3">
        <h3 className="text-base font-semibold" style={{ color: "#111827" }}>
          6. Contact Information
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          If you have any questions about these Terms of Use, please contact us:
        </p>
        <div className="bg-gray-100 rounded-lg p-3 space-y-1">
          <p className="text-sm text-gray-700">
            <strong>Email:</strong> legal@waypoint.com
          </p>
          <p className="text-sm text-gray-700">
            <strong>Address:</strong> Waypoint Inc., 123 Fitness Ave, San Francisco, CA 94102
          </p>
          <p className="text-sm text-gray-700">
            <strong>Phone:</strong> +1 (555) 123-MOVE
          </p>
        </div>
      </section>
    </div>
  );
}

export default TermsOfUseModal;
