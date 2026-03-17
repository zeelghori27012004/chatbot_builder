export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: June 25, 2025
          </p>
        </div>

        {/* Intro */}
        <p className="mb-6 text-sm text-black leading-relaxed">
          The terms "We", "Us", "Our", or "Company" refer to the owners and
          operators of this Whatsapp Chatbot website. The terms "You", "Your",
          or "User" refer to the users of this application. This Privacy Policy
          is an electronic record in accordance with the Information Technology
          Act, 2000 and the rules thereunder, including the Information
          Technology (Reasonable Security Practices and Procedures and Sensitive
          Personal Data or Information) Rules, 2011. This document does not
          require any physical, electronic, or digital signature. By using this
          Website, you agree to the terms of this Privacy Policy. If you do not
          agree, please do not use the Website. By providing your information or
          using the Website’s features, you consent to the collection, storage,
          processing, and transfer of your information as described in this
          policy.
        </p>

        {/* Sections */}
        {[
          {
            title: "1. User Information",
            content: (
              <>
                <p className="mb-2">
                  You may be required to provide personal information including:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Mobile number</li>
                  <li>Password</li>
                </ul>
                <p className="mt-4">
                  This information is used to maintain accounts, enhance our
                  services, and ensure security. Publicly available or legally
                  disclosed information is not considered sensitive.
                </p>
              </>
            ),
          },
          {
            title: "2. Cookies and Tracking",
            content: (
              <p>
                We may use cookies or similar technologies to enhance your
                experience, track activity, and assign unique IDs. Cookies do
                not contain personal data unless you provide it. Our servers may
                log technical data like IP address, browser, and device info for
                analytics and security.
              </p>
            ),
          },
          {
            title: "3. Links to Other Sites",
            content: (
              <p>
                Our platform may contain links to third-party websites. We are
                not responsible for the content or privacy practices of these
                external sites.
              </p>
            ),
          },
          {
            title: "4. Information Sharing",
            content: (
              <>
                <p className="mb-2">
                  We do not share sensitive personal data except:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>When required by law or court order</li>
                  <li>To investigate illegal activity or policy violations</li>
                  <li>
                    With trusted service providers under strict confidentiality
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: "5. Information Security",
            content: (
              <>
                <p className="mb-2">
                  We employ industry-standard safeguards to protect your data,
                  including:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Encrypted storage and transmission</li>
                  <li>Access control and authentication</li>
                  <li>Secure servers and databases</li>
                  <li>Periodic security audits and updates</li>
                </ul>
                <p className="mt-4">
                  While we strive to protect your data, no method is 100%
                  secure.
                </p>
              </>
            ),
          },
          {
            title: "6. Data Retention",
            content: (
              <p>
                Your data will be retained only for as long as necessary for the
                purposes described or as required by law.
              </p>
            ),
          },
          {
            title: "7. Changes to This Policy",
            content: (
              <p>
                We may update this policy periodically. Continued use of the
                platform after changes implies acceptance of the updated terms.
              </p>
            ),
          },
          {
            title: "8. Grievance Redressal",
            content: (
              <>
                <p className="mb-2">
                  For any complaints, concerns, or requests regarding your data or this policy, please contact our Grievance Officer:
                </p>
                <div className="text-sm text-gray-800 space-y-1">
                  <p className="font-medium">Grievance Officer</p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:support@chatforge.io"
                      className="text-blue-600 underline"
                    >
                      Email
                    </a>
                  </p>
                  <p>Address:</p>
                  <p>Phone: </p>
                </div>
              </>
            ),
          },
        ].map((section, idx) => (
          <div key={idx} className="mt-10">
            <h2 className="text-xl font-semibold text-blue-700 mb-3">
              {section.title}
            </h2>
            <div className="text-sm text-black leading-relaxed">
              {section.content}
            </div>
          </div>
        ))}

        {/* Footer Note */}
        <p className="text-xs text-gray-500 mt-12 text-center">
          By using this Website, you acknowledge that you have read and
          understood this Privacy Policy.
        </p>
      </div>
    </div>
  );
}
