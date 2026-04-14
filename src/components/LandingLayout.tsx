import React, { ReactNode } from 'react';

interface LandingLayoutProps {
  children: ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(123, 255, 187, 0.18), transparent 55%), radial-gradient(circle at 80% 10%, rgba(102, 217, 255, 0.18), transparent 60%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#05070d]/70 via-[#0c1427]/80 to-[#05070d]" />
        <div
          className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[rgba(123,255,187,0.14)] blur-[120px]"
          style={{ animation: 'floatSlow 22s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[-140px] right-[-80px] h-[380px] w-[420px] rounded-full bg-[rgba(102,217,255,0.18)] blur-[110px]"
          style={{ animation: 'floatSlow 26s ease-in-out infinite', animationDelay: '6s' }}
        />
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/noise_txsv6s.png')] opacity-[0.04] mix-blend-screen" />
      </div>
      <main className="relative z-10 flex flex-col gap-10 md:gap-16">
        {children}
      </main>
    </div>
  );
};

export default LandingLayout;
