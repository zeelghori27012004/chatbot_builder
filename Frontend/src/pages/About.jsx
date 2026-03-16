export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-blue-600">About ChatForge</h1>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          We’re building the future of chatbot automation — simple, visual, and ready for WhatsApp.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-center">
        <div>
          <img
            src="https://via.placeholder.com/600x350.png?text=Flow+Builder+Interface"
            alt="Flow Builder Interface"
            className="rounded-xl shadow"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Journey</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            ChatForge was born from the need to simplify how businesses build conversations. We saw teams
            struggling with rigid chatbot tools and limited API options. So we built a visual canvas that
            combines drag-and-drop logic, real-time flows, and deep WhatsApp Business API integration.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-blue-50 rounded-2xl px-8 py-12 text-center mb-16">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Mission</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          To empower anyone from developers to marketers to create intelligent, interactive
          conversations without code.
        </p>
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Vision</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          To become the go-to platform for designing and deploying conversational flows across all messaging platforms.
        </p>
      </div>

      {/* What Sets Us Apart */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">What Sets Us Apart</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Drag & Drop Interface</h3>
            <p className="text-sm text-gray-600">
              Visually build conversation logic with intuitive nodes and connections — no code required.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Native WhatsApp Support</h3>
            <p className="text-sm text-gray-600">
              Deep integration with WhatsApp Business APIs ensures reliable, real-time message handling.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Real-Time Logic Execution</h3>
            <p className="text-sm text-gray-600">
              Handle inputs, buttons, APIs, retries, and user paths instantly with dynamic flow execution.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Ready to build smarter conversations?</h2>
        <p className="text-gray-600 mt-2">Get started with ChatForge and create your first WhatsApp chatbot in minutes.</p>
        <a
          href="/register"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
        >
          Join ChatForge
        </a>
      </div>
    </div>
  );
}
