import { PackageX } from 'lucide-react';

export const EmptyState = ({ icon: Icon = PackageX, title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-brand-soft rounded-full p-6 mb-6">
        <Icon className="w-16 h-16 text-brand-primary" />
      </div>
      <h3 className="text-2xl font-bold text-dark mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {action}
    </div>
  );
};

export default EmptyState;

