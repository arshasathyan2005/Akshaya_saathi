import { useState, useEffect } from 'react';
import { LogOut, Plus, Edit, Trash2, Loader2, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, documentId, deleteDoc, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import type { Service, Center } from '../lib/database.types';
import { ServiceForm } from './ServiceForm';

export function AdminDashboard() {
  const { signOut, adminUser } = useAuth();
  console.log('[AdminDashboard] adminUser:', adminUser);
  const [center, setCenter] = useState<Center | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (adminUser) {
      fetchCenterAndServices();
    }
  }, [adminUser]);

  const fetchCenterAndServices = async () => {
    if (!adminUser) return;

    try {
      setLoading(true);
      
      // Fetch center data
      const centerDoc = await getDoc(doc(db, 'centers', adminUser.centerId));
      if (!centerDoc.exists()) {
        setError('Center not found');
        setLoading(false);
        return;
      }
      
      const centerData = {
        id: centerDoc.id,
        ...centerDoc.data(),
      } as Center;
      console.log('[AdminDashboard] Center data:', centerData);
      setCenter(centerData);

      // Fetch services for this center
      if (centerData.services.length === 0) {
        setServices([]);
        setLoading(false);
        return;
      }

      const servicesRef = collection(db, 'services');
      const serviceIds = centerData.services;
      const batchSize = 10;
      const batches = [];
      
      for (let i = 0; i < serviceIds.length; i += batchSize) {
        const batch = serviceIds.slice(i, i + batchSize);
        const q = query(servicesRef, where(documentId(), 'in', batch));
        batches.push(getDocs(q));
      }
      
      const results = await Promise.all(batches);
      const servicesData: Service[] = [];
      
      results.forEach((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          servicesData.push({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate() || new Date(),
            updated_at: doc.data().updated_at?.toDate() || new Date(),
          } as Service);
        });
      });
      
      servicesData.sort((a, b) => a.service_name.localeCompare(b.service_name));
      console.log('[AdminDashboard] Services fetched:', servicesData);
      setServices(servicesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    if (!adminUser) return;

    try {
      setDeletingId(id);
      
      // Delete the service document
      await deleteDoc(doc(db, 'services', id));
      
      // Remove service ID from center's services array
      await updateDoc(doc(db, 'centers', adminUser.centerId), {
        services: arrayRemove(id)
      });
      
      await fetchCenterAndServices();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete service');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingService(null);
  };

  const handleFormSuccess = () => {
    fetchCenterAndServices();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              {center && (
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm capitalize font-medium">{center.place}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{center.phone_number}</span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">All Services</h2>
            <p className="text-gray-600 text-sm mt-1">
              {services.length} service{services.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => {
              setEditingService(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">No services yet</p>
            <p className="text-gray-500 text-sm mt-2">Click "Add Service" to get started</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Processing Time
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{service.service_name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{service.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                          {service.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {service.fees || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {service.processing_time || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            disabled={deletingId === service.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === service.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showForm && (
        <ServiceForm
          service={editingService}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
