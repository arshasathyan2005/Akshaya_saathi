import { useState, useEffect } from 'react';
import { Search, Loader2, MapPin, Phone } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import type { Service } from '../lib/database.types';
import { CategoryFilter } from './CategoryFilter';
import { ServiceCard } from './ServiceCard';
import { useCenter } from '../contexts/CenterContext';

interface HomePageProps {
  onServiceClick: (service: Service) => void;
}

export function HomePage({ onServiceClick }: HomePageProps) {
  const { selectedCenter } = useCenter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (selectedCenter) {
      fetchServices();
    }
  }, [selectedCenter]);

  const fetchServices = async () => {
    if (!selectedCenter || selectedCenter.services.length === 0) {
      setServices([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const servicesRef = collection(db, 'services');
      
      // Firestore 'in' query has a limit of 10 items, so we need to batch if more
      const serviceIds = selectedCenter.services;
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
      
      // Sort by service name
      servicesData.sort((a, b) => a.service_name.localeCompare(b.service_name));
      
      setServices(servicesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.service_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Center Information Banner */}
      {selectedCenter && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold capitalize mb-1">
                Akshaya Center - {selectedCenter.place}
              </h2>
              <div className="flex items-center gap-2 text-blue-100">
                <Phone className="w-4 h-4" />
                <span>{selectedCenter.phone_number}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {filteredServices.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No services found</p>
          <p className="text-gray-500 text-sm mt-2">
            {services.length === 0
              ? 'This center has no services available yet'
              : 'Try adjusting your search or filter'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredServices.length}</span> service{filteredServices.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => onServiceClick(service)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
