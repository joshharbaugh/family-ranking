// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export default function FamilyOverviewSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} space-y-6 bg-gray-100`}
      />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"></div>
    </>
  );
}
