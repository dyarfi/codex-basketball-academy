import { Link } from '@redwoodjs/router'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-800">Basketball Academy</h1>
            <div className="space-x-4">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Basketball Academy
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Train with the best coaches and improve your basketball skills
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
          >
            Get Started
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-2">Expert Coaches</h3>
            <p className="text-gray-600">
              Learn from experienced basketball professionals with years of teaching experience.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-2">Skill Development</h3>
            <p className="text-gray-600">
              Comprehensive training programs designed to improve your basketball skills at any level.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-gray-600">
              Join a vibrant community of basketball enthusiasts and teammates.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-4">How It Works</h3>
          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold mr-4 flex-shrink-0">
                1
              </span>
              <p className="text-gray-700">
                <strong>Create your account</strong> - Sign up with your email and personal details
              </p>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold mr-4 flex-shrink-0">
                2
              </span>
              <p className="text-gray-700">
                <strong>Choose your role</strong> - Select your role (Player, Parent, Coach, or Prospect)
              </p>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold mr-4 flex-shrink-0">
                3
              </span>
              <p className="text-gray-700">
                <strong>Browse programs</strong> - Explore available basketball programs
              </p>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold mr-4 flex-shrink-0">
                4
              </span>
              <p className="text-gray-700">
                <strong>Enroll and train</strong> - Join classes and start your basketball journey
              </p>
            </li>
          </ol>
        </div>
      </main>
    </div>
  )
}

export default HomePage
