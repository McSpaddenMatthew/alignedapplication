import React from "react";

type CarouselProps = {
  children: React.ReactNode;
  className?: string;
};

type CarouselItemProps = {
  children: React.ReactNode;
};

export const Carousel: React.FC<CarouselProps> = ({ children, className = "" }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth px-4 py-2">
        {children}
      </div>
    </div>
  );
};

export const CarouselContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const CarouselItem: React.FC<CarouselItemProps> = ({ children }) => {
  return (
    <div className="min-w-full md:min-w-[33%] snap-start">
      {children}
    </div>
  );
};
