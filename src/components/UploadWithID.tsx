import { useState } from 'react';
import './UploadWithID.css';

// Define interfaces for our data structures
interface Country {
  id: string;
  name: string;
}

interface Region {
  id: string;
  countryId: string;
  name: string;
}

interface City {
  id: string;
  regionId: string;
  name: string;
}

const UploadWithID = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [location, setLocation] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');

  // Sample data for Middle East countries and their regions
  const countries: Country[] = [
    { id: 'SA', name: 'Saudi Arabia' },
    { id: 'AE', name: 'United Arab Emirates' },
    { id: 'QA', name: 'Qatar' },
    { id: 'BH', name: 'Bahrain' },
    { id: 'KW', name: 'Kuwait' },
    { id: 'OM', name: 'Oman' },
    // Add more countries as needed
  ];

  const regions: Region[] = [
    // Saudi Arabia regions
    { id: 'RD', countryId: 'SA', name: 'Riyadh Region' },
    { id: 'MK', countryId: 'SA', name: 'Makkah Region' },
    { id: 'MD', countryId: 'SA', name: 'Medina Region' },
    // UAE regions
    { id: 'AB', countryId: 'AE', name: 'Abu Dhabi' },
    { id: 'DB', countryId: 'AE', name: 'Dubai' },
    { id: 'SJ', countryId: 'AE', name: 'Sharjah' },
    // Add more regions as needed
  ];

  const cities: City[] = [
    // Riyadh Region cities
    { id: 'RY', regionId: 'RD', name: 'Riyadh' },
    { id: 'KH', regionId: 'RD', name: 'Kharj' },
    // Makkah Region cities
    { id: 'MK', regionId: 'MK', name: 'Makkah' },
    { id: 'JD', regionId: 'MK', name: 'Jeddah' },
    // Abu Dhabi cities
    { id: 'AB', regionId: 'AB', name: 'Abu Dhabi City' },
    { id: 'AW', regionId: 'AB', name: 'Al Ain' },
    // Add more cities as needed
  ];

  const filteredRegions = regions.filter(region => region.countryId === selectedCountry);
  const filteredCities = cities.filter(city => city.regionId === selectedRegion);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', {
      country: selectedCountry,
      region: selectedRegion,
      city: selectedCity,
      location,
      inspectionDate
    });
    // Add your form submission logic here
  };

  return (
    <div className="uploadContainer">
      <button className="uploadButton" onClick={() => setIsModalOpen(true)}>
        Upload With ID
      </button>

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <button className="closeButton" onClick={() => setIsModalOpen(false)}>
              ×
            </button>
            <h2>Upload With ID</h2>
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedRegion('');
                    setSelectedCity('');
                  }}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label htmlFor="region">Region</label>
                <select
                  id="region"
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setSelectedCity('');
                  }}
                  required
                  disabled={!selectedCountry}
                >
                  <option value="">Select Region</option>
                  {filteredRegions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label htmlFor="city">City</label>
                <select
                  id="city"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  required
                  disabled={!selectedRegion}
                >
                  <option value="">Select City</option>
                  {filteredCities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label htmlFor="inspectionDate">Inspection Date</label>
                <input
                  type="date"
                  id="inspectionDate"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="submitButton">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWithID;
