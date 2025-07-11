function PrivacyPolicyModal() {
  return (
    <div className="space-y-6 text-gray-800">
      <p className="text-xs text-gray-500 text-center">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <section className="space-y-3">
        <h3 className="text-base font-semibold" style={{ color: "#111827" }}>
          1. Information We Collect
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          When you create an account, we collect information such as your name,
          email address, and password.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold" style={{ color: "#111827" }}>
          2. How We Use Your Information
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          We use the information we collect to provide and maintain our fitness
          tracking services.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold" style={{ color: "#111827" }}>
          3. Contact Us
        </h3>
        <div className="bg-gray-100 rounded-lg p-3 space-y-1">
          <p className="text-sm text-gray-700">
            <strong>Email:</strong> privacy@waypoint.com
          </p>
          <p className="text-sm text-gray-700">
            <strong>Address:</strong> Waypoint Inc., 123 Fitness Ave, San
            Francisco, CA 94102
          </p>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicyModal;
