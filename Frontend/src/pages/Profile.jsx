import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/User.context";
import { FaYoutube, FaInstagram, FaFacebook, FaTwitter, FaGithub, FaGlobe } from "react-icons/fa";
import { updateProfile, getProfile } from "../services/authService";
import { useUser } from "../context/User.context";

export default function Profile() {
  const { user, setUser } = useUser ? useUser() : useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    companyName: user?.companyName || "",
    description: user?.description || "",
    socialHandles: {
      youtube: user?.socialHandles?.youtube || "",
      instagram: user?.socialHandles?.instagram || "",
      facebook: user?.socialHandles?.facebook || "",
      twitter: user?.socialHandles?.twitter || "",
      github: user?.socialHandles?.github || "",
      website: user?.socialHandles?.website || "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(true);
      getProfile()
        .then((data) => {
          setUser(data.user);
          setForm({
            fullname: data.user.fullname || "",
            email: data.user.email || "",
            phoneNumber: data.user.phoneNumber || "",
            companyName: data.user.companyName || "",
            description: data.user.description || "",
            socialHandles: {
              youtube: data.user.socialHandles?.youtube || "",
              instagram: data.user.socialHandles?.instagram || "",
              facebook: data.user.socialHandles?.facebook || "",
              twitter: data.user.socialHandles?.twitter || "",
              github: data.user.socialHandles?.github || "",
              website: data.user.socialHandles?.website || "",
            },
          });
        })
        .catch(() => setError("Failed to load profile"))
        .finally(() => setLoading(false));
    } else {
      setForm({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        companyName: user.companyName || "",
        description: user.description || "",
        socialHandles: {
          youtube: user.socialHandles?.youtube || "",
          instagram: user.socialHandles?.instagram || "",
          facebook: user.socialHandles?.facebook || "",
          twitter: user.socialHandles?.twitter || "",
          github: user.socialHandles?.github || "",
          website: user.socialHandles?.website || "",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["youtube", "instagram", "facebook", "twitter", "github", "website"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        socialHandles: { ...prev.socialHandles, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await updateProfile(form);
      setUser(data.user);
      setForm({
        fullname: data.user.fullname || "",
        email: data.user.email || "",
        phoneNumber: data.user.phoneNumber || "",
        companyName: data.user.companyName || "",
        description: data.user.description || "",
        socialHandles: {
          youtube: data.user.socialHandles?.youtube || "",
          instagram: data.user.socialHandles?.instagram || "",
          facebook: data.user.socialHandles?.facebook || "",
          twitter: data.user.socialHandles?.twitter || "",
          github: data.user.socialHandles?.github || "",
          website: data.user.socialHandles?.website || "",
        },
      });
      setSuccess("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-8">
      <div className="bg-white rounded-lg shadow-lg shadow-blue-100 border border-blue-600 p-8 w-full max-w-xl">
        <div className="text-xl font-semibold mb-6 text-gray-700">Profile</div>
        <div className="divide-y">
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold text-gray-800">Name</span>
            {editMode ? (
              <input
                className="border rounded px-2 py-1 w-2/3"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
              />
            ) : (
              <span className="text-gray-600">{form.fullname || "-"}</span>
            )}
          </div>
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold text-gray-800">Email</span>
            {editMode ? (
              <input
                className="border rounded px-2 py-1 w-2/3"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            ) : (
              <span className="text-gray-600">{form.email || "-"}</span>
            )}
          </div>
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold text-gray-800">Contact Number</span>
            {editMode ? (
              <input
                className="border rounded px-2 py-1 w-2/3"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
              />
            ) : (
              <span className="text-gray-600">{form.phoneNumber || "-"}</span>
            )}
          </div>
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold text-gray-800">Company Name</span>
            {editMode ? (
              <input
                className="border rounded px-2 py-1 w-2/3"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
              />
            ) : (
              <span className="text-gray-600">{form.companyName && form.companyName.trim() !== "" ? form.companyName : "-"}</span>
            )}
          </div>
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold text-gray-800">Description</span>
            {editMode ? (
              <textarea
                className="border rounded px-2 py-1 w-2/3 min-h-[80px] resize-y"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            ) : (
              <span className="text-gray-600">{form.description && form.description.trim() !== "" ? form.description : "-"}</span>
            )}
          </div>
          {/* Social Handles Section */}
          <div className="mt-8">
            <div className="mb-2 text-gray-600 font-medium">Add your social handles below</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center bg-gray-100 rounded px-3 py-2">
                <FaYoutube className="mr-2 text-xl text-gray-600" />
                <input
                  type="url"
                  name="youtube"
                  placeholder="https://"
                  className="bg-transparent outline-none w-full"
                  value={form.socialHandles.youtube}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div className="flex items-center bg-gray-100 rounded px-3 py-2">
                <FaInstagram className="mr-2 text-xl text-gray-600" />
                <input
                  type="url"
                  name="instagram"
                  placeholder="https://"
                  className="bg-transparent outline-none w-full"
                  value={form.socialHandles.instagram}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div className="flex items-center bg-gray-100 rounded px-3 py-2">
                <FaFacebook className="mr-2 text-xl text-gray-600" />
                <input
                  type="url"
                  name="facebook"
                  placeholder="https://"
                  className="bg-transparent outline-none w-full"
                  value={form.socialHandles.facebook}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div className="flex items-center bg-gray-100 rounded px-3 py-2">
                <FaTwitter className="mr-2 text-xl text-gray-600" />
                <input
                  type="url"
                  name="twitter"
                  placeholder="https://"
                  className="bg-transparent outline-none w-full"
                  value={form.socialHandles.twitter}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div className="flex items-center bg-gray-100 rounded px-3 py-2">
                <FaGithub className="mr-2 text-xl text-gray-600" />
                <input
                  type="url"
                  name="github"
                  placeholder="https://"
                  className="bg-transparent outline-none w-full"
                  value={form.socialHandles.github}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div className="flex items-center bg-gray-100 rounded px-3 py-2">
                <FaGlobe className="mr-2 text-xl text-gray-600" />
                <input
                  type="url"
                  name="website"
                  placeholder="https://"
                  className="bg-transparent outline-none w-full"
                  value={form.socialHandles.website}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
            </div>
          </div>
        </div>
        {editMode ? (
          <button
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleSave}
          >
            Save
          </button>
        ) : (
          <button
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleEdit}
          >
            Edit
          </button>
        )}
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {loading && <div className="text-gray-500 mt-2">Loading...</div>}
      </div>
    </div>
  );
} 