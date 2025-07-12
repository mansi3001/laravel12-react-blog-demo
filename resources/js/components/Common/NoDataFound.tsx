import { FileX } from 'lucide-react';

interface NoDataFoundProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function NoDataFound({ 
  title = "No Data Found", 
  description = "There are no records to display.",
  icon 
}: NoDataFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-gray-400">
        {icon || <FileX className="h-16 w-16" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm">{description}</p>
    </div>
  );
}