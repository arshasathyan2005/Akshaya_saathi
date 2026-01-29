import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { Center } from '../lib/database.types';

interface CenterContextType {
  selectedCenter: Center | null;
  centers: Center[];
  loading: boolean;
  selectCenter: (center: Center) => void;
  clearCenter: () => void;
}

const CenterContext = createContext<CenterContextType | undefined>(undefined);

const STORAGE_KEY = 'akshaya_selected_center';

export function CenterProvider({ children }: { children: ReactNode }) {
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all centers from Firestore
  useEffect(() => {
    fetchCenters();
  }, []);

  // Load selected center from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSelectedCenter(parsed);
      } catch (error) {
        console.error('Failed to parse stored center:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const centersRef = collection(db, 'centers');
      const q = query(centersRef, orderBy('place', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const centersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Center[];
      
      setCenters(centersData);
    } catch (error) {
      console.error('Failed to fetch centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectCenter = (center: Center) => {
    setSelectedCenter(center);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(center));
  };

  const clearCenter = () => {
    setSelectedCenter(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CenterContext.Provider
      value={{
        selectedCenter,
        centers,
        loading,
        selectCenter,
        clearCenter,
      }}
    >
      {children}
    </CenterContext.Provider>
  );
}

export function useCenter() {
  const context = useContext(CenterContext);
  if (context === undefined) {
    throw new Error('useCenter must be used within a CenterProvider');
  }
  return context;
}
