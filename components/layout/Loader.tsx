export const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-800">
      <div className="w-16 h-16 border-4 !border-t-indigo-600 border-gray-200 dark:border-zinc-600 rounded-full animate-spin" />
    </div>
  );
};

export const MiniAvatarLoader = () => {
  return (
    <div className="w-10 h-10 rounded-full animate-pulse bg-gray-300 dark:bg-zinc-600" />
  );
};
