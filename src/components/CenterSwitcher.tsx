import { useState } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';
import { useCenter } from '../contexts/CenterContext';

export function CenterSwitcher() {
  const { selectedCenter, clearCenter } = useCenter();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!selectedCenter) return null;

  const handleChangeLocation = () => {
    setShowConfirm(true);
  };

  const confirmChange = () => {
    clearCenter();
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={handleChangeLocation}
        className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
        title="Change center"
      >
        <MapPin className="w-4 h-4 text-blue-600" />
        <div className="text-left hidden sm:block">
          <div className="text-xs text-gray-600">Location</div>
          <div className="text-sm font-medium text-gray-900 capitalize">
            {selectedCenter.place}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Change Location?
              </h3>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to change your Akshaya center? This will take you back to the center selection screen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmChange}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Change Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
