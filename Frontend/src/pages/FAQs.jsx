import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is ChatForge?",
    answer:
      "ChatForge is a drag-and-drop chatbot builder designed for WhatsApp and other messaging platforms. It lets you create complex conversational flows without writing code.",
  },
  {
    question: "Do I need coding experience?",
    answer:
      "Not at all! ChatForge is built to be user-friendly for non-technical users. Just drag, drop, and connect logic using nodes.",
  },
  {
    question: "Does ChatForge support WhatsApp integration?",
    answer:
      "Yes. ChatForge is built specifically with WhatsApp Business API support for seamless real-time communication.",
  },
  {
    question: "Can I test my bot before publishing?",
    answer:
      "Absolutely! You can simulate and preview your chatbot flow directly within the ChatForge interface.",
  },
  {
    question: "Is ChatForge free to use?",
    answer:
      "We offer a free plan with core features. For advanced functionality, integrations, and higher usage limits, upgrade to one of our premium plans.",
  },
  {
    question: "How do I connect my WhatsApp number?",
    answer:
      "During setup, we guide you step-by-step through connecting your verified WhatsApp Business number using Meta’s API.",
  },
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600">Frequently Asked Questions</h1>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Everything you need to know about using ChatForge effectively.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden shadow-sm transition"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 focus:outline-none"
            >
              <span className="text-gray-800 font-medium">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="text-blue-600 w-5 h-5" />
              ) : (
                <ChevronDown className="text-blue-600 w-5 h-5" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-sm text-gray-600 bg-white">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Still have questions?
        </h2>
        <p className="text-gray-600 mt-2">
          Reach out to our support team — we're here to help.
        </p>
        <a
          href="/support"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
