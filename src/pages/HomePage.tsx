import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Experience from '../components/Experience';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Experience />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;