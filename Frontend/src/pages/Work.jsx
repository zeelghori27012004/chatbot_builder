import { Brain, ShoppingBag, HeartPulse, GraduationCap, Headset, Building2 } from "lucide-react";

export default function Work() {
  const projects = [
    {
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      title: "Smart FAQ Bot",
      industry: "Technology",
      description: "Reduced support ticket volume by 40% using an interactive FAQ bot on WhatsApp.",
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-blue-600" />,
      title: "E-commerce Sales Assistant",
      industry: "Retail",
      description: "Helped customers browse products and place orders directly from chat.",
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-blue-600" />,
      title: "Appointment Scheduler",
      industry: "Healthcare",
      description: "Automated appointment booking and reminders for clinics via WhatsApp.",
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
      title: "Student Helpdesk Bot",
      industry: "Education",
      description: "Deployed at a university to answer common student queries 24/7.",
    },
    {
      icon: <Headset className="w-6 h-6 text-blue-600" />,
      title: "Customer Support Bot",
      industry: "SaaS",
      description: "Resolved common user issues instantly, improving CSAT scores significantly.",
    },
    {
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
      title: "Lead Qualification Bot",
      industry: "Real Estate",
      description: "Qualified incoming leads and routed them to sales agents instantly.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600">Our Work</h1>
        <p className="mt-4 text-gray-600 text-lg">
          Explore how ChatForge is helping businesses automate and enhance their communication workflows.
        </p>
      </div>

      {/* Work Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj, index) => (
          <div key={index} className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
            <div className="bg-blue-100 p-3 inline-block rounded-xl mb-4">
              {proj.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{proj.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{proj.industry}</p>
            <p className="text-sm text-gray-600">{proj.description}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Want to build something similar?</h2>
        <p className="text-gray-600 mt-2">Let ChatForge help you automate, engage, and convert at scale.</p>
        <a
          href="/register"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
