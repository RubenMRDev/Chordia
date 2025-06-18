import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Experience from '../components/Experience';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import PianoTest from '../components/PianoTest';

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Experience />
        <CallToAction />
        {/* Temporary Piano Test Component */}
        <div className="container mx-auto px-4 py-8">
          <PianoTest />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;