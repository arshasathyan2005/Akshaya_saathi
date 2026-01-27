import { ArrowLeft, FileText, ListChecks, IndianRupee, Clock, AlertCircle } from 'lucide-react';
import type { Service } from '../lib/database.types';

interface ServiceDetailsProps {
  service: Service;
  onBack: () => void;
}

export function ServiceDetails({ service, onBack }: ServiceDetailsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Services
      </button>

      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-3">
            {service.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.service_name}</h1>
          <p className="text-gray-600 text-lg leading-relaxed">{service.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {service.fees && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                <IndianRupee className="w-5 h-5" />
                <span>Fees</span>
              </div>
              <p className="text-gray-900 font-medium">{service.fees}</p>
            </div>
          )}
          {service.processing_time && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                <Clock className="w-5 h-5" />
                <span>Processing Time</span>
              </div>
              <p className="text-gray-900 font-medium">{service.processing_time}</p>
            </div>
          )}
        </div>

        {service.documents_required.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-xl mb-4">
              <FileText className="w-6 h-6" />
              <h2>Required Documents</h2>
            </div>
            <ul className="space-y-2">
              {service.documents_required.map((doc, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {service.procedure_steps.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-xl mb-4">
              <ListChecks className="w-6 h-6" />
              <h2>Procedure Steps</h2>
            </div>
            <ol className="space-y-4">
              {service.procedure_steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <div className="pt-1 flex-1">
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {service.notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Important Notes</h3>
                <p className="text-amber-800 leading-relaxed">{service.notes}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">
            Note: Please confirm the latest requirements and procedures with your local Akshaya center before proceeding.
          </p>
        </div>
      </div>
    </div>
  );
}
