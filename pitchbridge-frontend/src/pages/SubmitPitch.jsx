import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const SubmitPitch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    founder: "",
    website: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to submit a pitch.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/startups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Pitch submitted successfully!");
        setFormData({
          name: "",
          description: "",
          industry: "",
          founder: "",
          website: "",
        });
        setTimeout(() => navigate("/startups"), 1500);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Submit Your Pitch
        </h2>

        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            name="name"
            placeholder="Startup Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 rounded-md border dark:bg-gray-700 dark:text-white"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="p-3 rounded-md border dark:bg-gray-700 dark:text-white"
            rows={4}
          />
          <input
            type="text"
            name="industry"
            placeholder="Industry"
            value={formData.industry}
            onChange={handleChange}
            required
            className="p-3 rounded-md border dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            name="founder"
            placeholder="Founder Name"
            value={formData.founder}
            onChange={handleChange}
            required
            className="p-3 rounded-md border dark:bg-gray-700 dark:text-white"
          />
          <input
            type="url"
            name="website"
            placeholder="Website URL"
            value={formData.website}
            onChange={handleChange}
            className="p-3 rounded-md border dark:bg-gray-700 dark:text-white"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold"
          >
            Submit Pitch
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitPitch;

