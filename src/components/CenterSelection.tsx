import { useState } from 'react';
import { MapPin, Phone, Search, Loader2 } from 'lucide-react';
import { useCenter } from '../contexts/CenterContext';
import type { Center } from '../lib/database.types';

export function CenterSelection() {
  const { centers, loading, selectCenter } = useCenter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCenters = centers.filter((center) =>
    center.place.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCenterSelect = (center: Center) => {
    selectCenter(center);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading centers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Select Your Akshaya Center
          </h1>
          <p className="text-lg text-gray-600">
            Choose your nearest center to view available services
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg"
            />
          </div>
        </div>

        {filteredCenters.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">No centers found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCenters.map((center) => (
              <button
                key={center.id}
                onClick={() => handleCenterSelect(center)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 text-left border-2 border-transparent hover:border-blue-500 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
                      {center.place}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{center.phone_number}</span>
                    </div>
                    <div className="mt-3 text-sm text-blue-600 font-medium">
                      {center.services.length} service{center.services.length !== 1 ? 's' : ''} available
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Can't find your center? Please contact support.</p>
        </div>
      </div>
    </div>
  );
}
