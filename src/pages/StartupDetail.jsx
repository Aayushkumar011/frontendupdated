import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

const StartupDetail = () => {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/startups/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Startup Detail fetched:", data);
        setStartup(data.data); // ✅ Corrected
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch startup:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading startup details...</div>;
  }

  if (!startup) {
    return <div className="text-center mt-20 text-red-500">Startup not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 px-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {startup.startupName || "Untitled Startup"}
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {startup.description || "No description provided."}
        </p>

        <div className="grid gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div><strong>Industry:</strong> {startup.domain || "N/A"}</div>
          <div><strong>Founder:</strong> {startup.founderId?.name || "N/A"}</div>
          <div><strong>Website:</strong>
            {startup.website ? (
              <a
                href={startup.website}
                className="text-blue-500 hover:underline ml-1"
                target="_blank"
                rel="noreferrer"
              >
                {startup.website}
              </a>
            ) : (
              " N/A"
            )}
          </div>
        </div>

        <Link
          to="/startups"
          className="inline-block mt-6 text-blue-600 hover:underline text-sm"
        >
          ← Back to Startups
        </Link>
      </div>
    </div>
  );
};

export default StartupDetail;

