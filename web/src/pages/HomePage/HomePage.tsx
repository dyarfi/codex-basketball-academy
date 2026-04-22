import { useState } from 'react'

import { Link } from '@redwoodjs/router'

const HomePage = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  const testimonials = [
    {
      name: 'Michael Johnson',
      role: 'Player',
      text: "The coaches here are incredible! I've improved my skills so much in just 3 months.",
      image: '🏀',
    },
    {
      name: 'Sarah Williams',
      role: 'Parent',
      text: 'My son loves coming to classes. The program is well-structured and the coaches are very supportive.',
      image: '👨‍👩‍👦',
    },
    {
      name: 'James Chen',
      role: 'Player',
      text: "Best basketball training academy I've ever been to. Highly recommended for anyone serious about basketball.",
      image: '🏀',
    },
  ]

  const programs = [
    { level: 'Beginner', description: 'Perfect for newcomers', icon: '🟢' },
    { level: 'Intermediate', description: 'Build on fundamentals', icon: '🟡' },
    { level: 'Advanced', description: 'Competitive training', icon: '🔴' },
    { level: 'Elite', description: 'Professional prep', icon: '⭐' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              🏀 Basketball Academy
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/programs"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Programs
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Elevate Your Basketball Game
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Train with experienced coaches and join a community of basketball
              enthusiasts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/programs"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Explore Programs
              </Link>
              <Link
                to="/signup"
                className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition border-2 border-white"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>

        {/* Programs Overview */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Our Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {programs.map((program) => (
                <div
                  key={program.level}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 text-center"
                >
                  <div className="text-4xl mb-4">{program.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {program.level}
                  </h3>
                  <p className="text-gray-600">{program.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/programs"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                View All Programs
              </Link>
            </div>
          </div>
        </section>

        {/* Features Highlights */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">👨‍🏫</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Expert Coaches
                </h3>
                <p className="text-gray-600">
                  Learn from experienced basketball professionals with certified
                  coaching credentials and years of playing and teaching
                  experience.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Skill Tracking
                </h3>
                <p className="text-gray-600">
                  Monitor your progress with detailed skill assessments, player
                  statistics, and personalized feedback from your coaches.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Community
                </h3>
                <p className="text-gray-600">
                  Join a vibrant community of athletes at all levels, make
                  friends, and grow together as basketball enthusiasts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-blue-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  number: '1',
                  title: 'Sign Up',
                  description: 'Create your account and choose your role',
                },
                {
                  number: '2',
                  title: 'Browse Programs',
                  description: 'Explore programs suited to your level',
                },
                {
                  number: '3',
                  title: 'Enroll',
                  description: 'Select classes and complete enrollment',
                },
                {
                  number: '4',
                  title: 'Train & Grow',
                  description: 'Start your basketball journey today',
                },
              ].map((step) => (
                <div key={step.number} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              What Our Members Say
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="text-5xl mb-4">
                  {testimonials[testimonialIndex].image}
                </div>
                <blockquote className="text-xl text-gray-700 mb-4 italic">
                  "{testimonials[testimonialIndex].text}"
                </blockquote>
                <p className="font-bold text-gray-900">
                  {testimonials[testimonialIndex].name}
                </p>
                <p className="text-gray-600 text-sm">
                  {testimonials[testimonialIndex].role}
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTestimonialIndex(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      index === testimonialIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join our community and begin your basketball training journey
              today
            </p>
            <Link
              to="/signup"
              className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition"
            >
              Sign Up Now
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-bold text-white mb-4">About Us</h4>
                <p className="text-sm">
                  Basketball Academy is dedicated to developing basketball
                  skills at all levels.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/programs"
                      className="hover:text-white transition"
                    >
                      Programs
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-white transition">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="hover:text-white transition">
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="mailto:support@basketball.com"
                      className="hover:text-white transition"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-sm">
              <p>&copy; 2026 Basketball Academy. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default HomePage
