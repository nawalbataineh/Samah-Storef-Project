export const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 w-full',
    title: 'h-8 w-3/4',
    text: 'h-4 w-full',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-64 w-full',
    image: 'h-48 w-full',
  };

  return (
    <div className={`skeleton rounded-2xl ${variants[variant]} ${className}`}></div>
  );
};

export const ProductCardSkeleton = () => (
  <div className="card p-4 space-y-4">
    <Skeleton variant="image" />
    <Skeleton variant="title" />
    <Skeleton variant="text" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

