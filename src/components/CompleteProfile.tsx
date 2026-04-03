import { useState } from 'react';
import { Building2, Loader2, LogOut } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface CompleteProfileProps {
  onSuccess: () => void;
}

export function CompleteProfile({ onSuccess }: CompleteProfileProps) {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    centerPlace: '',
    phoneNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setLoading(true);

    try {
      // Create center document
      const centerRef = await addDoc(collection(db, 'centers'), {
        place: formData.centerPlace.toLowerCase(),
        phone_number: formData.phoneNumber,
        services: [],
      });

      // Create user document linking admin to center
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: user.email,
        centerId: centerRef.id,
        role: 'admin',
      });

      console.log('[CompleteProfile] Profile created successfully for', user.email);
      onSuccess();
    } catch (err: any) {
      console.error('[CompleteProfile] Error:', err);
      setError(
        'Failed to save profile. Please make sure your Firestore Security Rules allow authenticated writes. Error: ' +
        (err.message || 'Unknown error')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 text-sm">
            Your account (<strong>{user?.email}</strong>) was created but your center profile is missing. 
            Please fill in the details below to complete setup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Center Location *
            </label>
            <input
              type="text"
              required
              value={formData.centerPlace}
              onChange={(e) => setFormData({ ...formData, centerPlace: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Mavelikara"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., +91 1234567890"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Complete Setup'
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <button
            onClick={() => signOut()}
            className="flex items-center justify-center gap-2 mx-auto text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out and use a different account
          </button>
        </div>
      </div>
    </div>
  );
}
