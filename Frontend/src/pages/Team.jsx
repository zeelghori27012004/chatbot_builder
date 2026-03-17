export default function Team() {
  const teamMembers = [
    {
      name: "Zeel Ghori",
      role: "Backend developer",
      image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png",
      bio: "",
    },
    {
      name: "Yash Tarpara",
      role: "Backend Developer",
      image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png",
      bio: "",
    },
    {
      name: "Dharmik Godhani",
      role: "Frontend Developer",
      image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png",
      bio: "",
    },
    {
      name: "Vardhman Mehta",
      role: "Backend Developer",
      image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png",
      bio: "",
    },
    {
      name: "Yash Mehta",
      role: "Backend Developer",
      image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png",
      bio: "",
    },

  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600">Meet the Team</h1>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          The passionate minds behind ChatForge – building the future of conversational automation.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 object-cover rounded-full mx-auto shadow mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
            <p className="text-sm text-blue-600 mb-2">{member.role}</p>
            <p className="text-sm text-gray-600">{member.bio}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Want to work with us?</h2>
        <p className="text-gray-600 mt-2">
          We’re always looking for passionate people to join the ChatForge mission.
        </p>
        <a
          href="/about"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
        >
          Learn More About Us
        </a>
      </div>
    </div>
  );
}
