import { FileText, Clock, IndianRupee, ChevronRight } from 'lucide-react';
import type { Service } from '../lib/database.types';

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-5 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{service.service_name}</h3>
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
            {service.category}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

      <div className="flex flex-wrap gap-4 text-sm">
        {service.fees && (
          <div className="flex items-center gap-1 text-gray-700">
            <IndianRupee className="w-4 h-4" />
            <span>{service.fees}</span>
          </div>
        )}
        {service.processing_time && (
          <div className="flex items-center gap-1 text-gray-700">
            <Clock className="w-4 h-4" />
            <span>{service.processing_time}</span>
          </div>
        )}
        {service.documents_required.length > 0 && (
          <div className="flex items-center gap-1 text-gray-700">
            <FileText className="w-4 h-4" />
            <span>{service.documents_required.length} documents</span>
          </div>
        )}
      </div>
    </div>
  );
}
