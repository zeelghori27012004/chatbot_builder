import { Bot, Workflow, PhoneCall, Zap, LayoutGrid, MessageCircle } from "lucide-react";

export default function Services() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600">Our Services</h1>
        <p className="mt-4 text-gray-600 text-lg">
          Empower your business with ChatForge — your all-in-one WhatsApp chatbot flow builder.
        </p>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Service Card */}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition">
          <div className="bg-blue-100 p-3 inline-block rounded-xl mb-4">
            <Workflow className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Visual Flow Builder</h3>
          <p className="mt-2 text-sm text-gray-600">
            Easily drag, drop, and connect nodes to create complex chatbot logic without writing code.
          </p>
        </div>

        {/* Service Card */}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition">
          <div className="bg-blue-100 p-3 inline-block rounded-xl mb-4">
            <PhoneCall className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">WhatsApp Integration</h3>
          <p className="mt-2 text-sm text-gray-600">
            Natively integrates with WhatsApp Business APIs for seamless message delivery and interaction.
          </p>
        </div>

        {/* Service Card */}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition">
          <div className="bg-blue-100 p-3 inline-block rounded-xl mb-4">
            <Zap className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Real-Time Execution</h3>
          <p className="mt-2 text-sm text-gray-600">
            Run flows in real-time with condition-based branching, retries, and validations.
          </p>
        </div>

        {/* Service Card */}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition">
          <div className="bg-blue-100 p-3 inline-block rounded-xl mb-4">
            <LayoutGrid className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Reusable Components</h3>
          <p className="mt-2 text-sm text-gray-600">
            Use reusable node templates for buttons, questions, API calls, and messages.
          </p>
        </div>

        {/* Service Card */}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition">
          <div className="bg-blue-100 p-3 inline-block rounded-xl mb-4">
            <MessageCircle className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Conversation Management</h3>
          <p className="mt-2 text-sm text-gray-600">
            Customize and manage conversations based on user input with persistent state.
          </p>
        </div>

        {/* Service Card */}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition">
          <div className="bg-blue-100 p-3 inline-block rounded-xl mb-4">
            <Bot className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">AI-Ready Architecture</h3>
          <p className="mt-2 text-sm text-gray-600">
            Built to integrate easily with AI engines like GPT for dynamic replies and smart flows.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Ready to build your first chatbot?</h2>
        <p className="text-gray-600 mt-2">Get started with ChatForge today and transform how you automate conversations.</p>
        <a
          href="/register"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
        >
          Create Account
        </a>
      </div>
    </div>
  );
}
