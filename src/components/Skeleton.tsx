import React from 'react';

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`bg-muted rounded ${className}`}
      {...props}
    />
  );
};

export default Skeleton;