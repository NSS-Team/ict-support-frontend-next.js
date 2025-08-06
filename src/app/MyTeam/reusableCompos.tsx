import {
  Users,
} from 'lucide-react';
/** Reusable components */
export const StatCard = ({ label, value, icon, color = 'text-slate-900' }: { label: string; value: string | number; icon: React.ReactNode; color?: string }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/50">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

export const InfoBlock = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) => (
  value ? (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-400" />
      <span>{label}: {value}</span>
    </div>
  ) : null
);

export const LoadingUI = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200"></div>
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
    </div>
    <p className="text-slate-600 mt-4 animate-pulse">Loading team members...</p>
  </div>
);

export const ErrorUI = () => (
  <div className="text-center py-12">
    <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
      <Users className="w-8 h-8 text-red-500" />
    </div>
    <p className="text-slate-600 font-medium">Error loading team members</p>
    <p className="text-slate-400 text-sm mt-1">Please try again later</p>
  </div>
);

export const EmptyUI = () => (
  <div className="text-center py-12">
    <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
      <Users className="w-8 h-8 text-slate-400" />
    </div>
    <p className="text-slate-500 font-medium">No team members found</p>
    <p className="text-slate-400 text-sm mt-1">Add members to your team to get started</p>
  </div>
);
