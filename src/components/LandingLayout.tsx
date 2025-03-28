import React, { ReactNode } from 'react';
interface LandingLayoutProps {
  children: ReactNode;
}
const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="overflow-x-hidden w-full">
      {children}
    </div>
  );
};
export default LandingLayout;
