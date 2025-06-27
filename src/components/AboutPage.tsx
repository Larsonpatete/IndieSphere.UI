import React from 'react';
import Globe from '../Assets/globe.svg';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative flex justify-center items-center mb-8" style={{ height: '120px' }}>
            <img
              src={Globe}
              alt="Globe"
              className="absolute inset-0 w-40 h-40 mx-auto pointer-events-none opacity-80"
              style={{ zIndex: 0 }}
            />
            <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg relative z-10">
              About Indie Sphere
            </h1>
          </div>
          <p className="text-xl text-blue-300 max-w-2xl mx-auto">
            Discover the universe of independent music beyond the mainstream.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12 text-gray-200">
          {/* About the Project */}
          <section className="bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Our Mission</h2>
            <p className="mb-4">
              Indie Sphere was created to help music enthusiasts discover independent artists 
              and tracks that often fly under the radar of mainstream platforms. We believe that 
              some of the most innovative, authentic, and meaningful music comes from independent 
              artists who don't have major label backing.
            </p>
            <p>
              Our platform combines data from multiple sources to provide a comprehensive view of 
              indie music across genres, time periods, and scenes. Whether you're looking for 
              underground electronic music, indie folk, or experimental jazz, Indie Sphere helps 
              you find hidden gems and connect with artists outside the mainstream.
            </p>
          </section>

          {/* Features */}
          <section className="bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-2">Deep Music Discovery</h3>
                <p>
                  Search across a vast catalog of independent music from around the world, with detailed 
                  audio features and metadata to help you find exactly what you're looking for.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-2">Comprehensive Details</h3>
                <p>
                  Get rich information about songs including audio characteristics, popularity metrics, 
                  and release information all in one place.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-2">Connect to Streaming</h3>
                <p>
                  Easily listen to tracks through integrated streaming services and add discoveries 
                  to your personal music library.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-2">Indie Focus</h3>
                <p>
                  Our platform is specifically designed to highlight independent artists and releases 
                  that deserve more attention.
                </p>
              </div>
            </div>
          </section>

          {/* Technology */}
          <section className="bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Technology</h2>
            <p className="mb-4">
              Indie Sphere is built using modern web technologies to provide a fast, responsive experience:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>React for a dynamic, responsive user interface</li>
              <li>TypeScript for type safety and improved developer experience</li>
              <li>Tailwind CSS for beautiful, customized styling</li>
              <li>Spotify API integration for comprehensive music data</li>
              <li>.NET backend for robust API management and data processing</li>
            </ul>
            <p>
              Our platform combines multiple music APIs and databases to create a unique music discovery 
              experience focused specifically on independent artists and releases.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Get In Touch</h2>
            <p className="mb-6">
              Have questions, suggestions, or feedback? We'd love to hear from you!
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a 
                href="https://github.com/Larsonpatete/IndieSphere.UI" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub Repository
              </a>
              <a 
                href="mailto:larsonpatete@gmail.com" 
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </a>
            </div>
          </section>
        </div>

        {/* Version Info */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Indie Sphere v1.0.0 • Exploring the independent music universe since 2025</p>
        </div>
      </div>
    </div>
  );
};