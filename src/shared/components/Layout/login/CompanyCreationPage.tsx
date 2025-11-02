import React, { useState } from "react";
import { api } from "../../../utils/api";

interface CompanyCreationPageProps {
  onSuccess: () => void;
}

const CompanyCreationPage: React.FC<CompanyCreationPageProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "",
    licenseNumber: "",
    city: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const { data } = await api.post("/companies", formData);

      if (data.success) {
        setSuccessMessage("Company created successfully! Redirecting...");
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message || error.message || "Company creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Create Your Company
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6">
        As a manager, you need to create a company first.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Enter company name"
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="companyType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Type
          </label>
          <select
            id="companyType"
            name="companyType"
            value={formData.companyType}
            onChange={handleInputChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select Company Type</option>
            <option value="real-estate">Real Estate</option>
            <option value="construction">Construction</option>
            <option value="property-management">Property Management</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="licenseNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            License Number
          </label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            placeholder="Enter license number"
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            City
          </label>
          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select City</option>
            <option value="riyadh">Riyadh</option>
            <option value="jeddah">Jeddah</option>
            <option value="dammam">Dammam</option>
            <option value="mecca">Mecca</option>
            <option value="medina">Medina</option>
          </select>
        </div>



        <button
          type="submit"
          disabled={loading || successMessage !== null}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
        >
          {loading
            ? "Creating Company..."
            : successMessage
            ? "Company Created!"
            : "Create Company"}
        </button>
      </form>
    </div>
  );
};

export default CompanyCreationPage;
