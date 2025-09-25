import type { HTMLAttributes } from 'react';

export function Skeleton(props: HTMLAttributes<HTMLDivElement>) {
  const { className = '', ...rest } = props;
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} {...rest} />;
}
