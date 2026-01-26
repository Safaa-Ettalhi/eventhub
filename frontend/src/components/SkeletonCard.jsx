const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden animate-pulse">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded skeleton w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded skeleton w-1/2"></div>
          </div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded skeleton"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded skeleton"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded skeleton w-5/6"></div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded skeleton w-2/3"></div>
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded skeleton w-1/2"></div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded skeleton mt-4"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
