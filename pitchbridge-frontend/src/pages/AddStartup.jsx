import React, { useState } from 'react';

const AddStartup = () => {
  const [formData, setFormData] = useState({
    name: '',
    idea: '',
    teamSize: '',
    stage: '',
    website: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting startup:", formData);
    // You can send this to backend using fetch or axios here
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Add Your Startup</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <input
          type="text"
          name="name"
          placeholder="Startup Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded border dark:bg-gray-700"
          required
        />
        <textarea
          name="idea"
          placeholder="Startup Idea"
          value={formData.idea}
          onChange={handleChange}
          className="w-full p-3 rounded border dark:bg-gray-700"
          required
        />
        <input
          type="number"
          name="teamSize"
          placeholder="Team Size"
          value={formData.teamSize}
          onChange={handleChange}
          className="w-full p-3 rounded border dark:bg-gray-700"
        />
        <input
          type="text"
          name="stage"
          placeholder="Startup Stage (e.g., Seed, Series A)"
          value={formData.stage}
          onChange={handleChange}
          className="w-full p-3 rounded border dark:bg-gray-700"
        />
        <input
          type="url"
          name="website"
          placeholder="Website URL (optional)"
          value={formData.website}
          onChange={handleChange}
          className="w-full p-3 rounded border dark:bg-gray-700"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Startup
        </button>
      </form>
    </div>
  );
};

export default AddStartup;
