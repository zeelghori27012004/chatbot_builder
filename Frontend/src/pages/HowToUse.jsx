import {
  LogIn,
  LayoutDashboard,
  Workflow,
  Bot,
  SendHorizonal,
  MonitorSmartphone,
} from "lucide-react";

export default function HowToUse() {
  const steps = [
    {
      icon: <LogIn className="w-6 h-6 text-blue-600" />,
      title: "1. Create an Account",
      description:
        "Sign up for a free ChatForge account to access the visual chatbot builder and workspace.",
    },
    {
      icon: <LayoutDashboard className="w-6 h-6 text-blue-600" />,
      title: "2. Access Dashboard",
      description:
        "Log in and land on your dashboard to view, manage, and create multiple chatbot projects.",
    },
    {
      icon: <Workflow className="w-6 h-6 text-blue-600" />,
      title: "3. Build Your Flow",
      description:
        "Use the drag-and-drop canvas to add nodes like messages, buttons, API calls, and validations.",
    },
    {
      icon: <Bot className="w-6 h-6 text-blue-600" />,
      title: "4. Connect with WhatsApp",
      description:
        "Integrate your WhatsApp Business number using our easy setup to start sending/receiving messages.",
    },
    {
      icon: <MonitorSmartphone className="w-6 h-6 text-blue-600" />,
      title: "5. Test Your Bot",
      description:
        "Simulate the entire conversation flow and make real-time edits with instant feedback.",
    },
    {
      icon: <SendHorizonal className="w-6 h-6 text-blue-600" />,
      title: "6. Go Live!",
      description:
        "Once you're satisfied, publish your chatbot and start engaging users instantly on WhatsApp.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-blue-600">How to Use ChatForge</h1>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Building powerful WhatsApp chatbots is now just a few clicks away. Follow these simple steps to get started.
        </p>
      </div>

      {/* Step-by-step Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <div className="bg-blue-100 p-3 rounded-xl inline-block mb-4">
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Optional Demo Image */}
      <div className="mt-20 text-center">
        <img
          src=""
          alt="Flow Builder Demo"
          className="mx-auto rounded-xl shadow"
        />
        <p className="text-sm text-gray-500 mt-2">A snapshot of the drag-and-drop flow builder</p>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Start Building with ChatForge Today</h2>
        <p className="text-gray-600 mt-2">
          Join hundreds of businesses already automating conversations on WhatsApp.
        </p>
        <a
          href="/register"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
        >
          Get Started Free
        </a>
      </div>
    </div>
  );
}
