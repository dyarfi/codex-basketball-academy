import { Link } from '@redwoodjs/router'

export const Links = ({ textClass }: { textClass?: string }) => {
  return (
    <div>
      <h3 className="mb-4 font-semibold text-blue-600">Quick Links</h3>
      <ul className={`space-y-2 text-sm ${textClass}`}>
        <li>
          <Link to="/programs" className="hover:text-blue-600">
            Programs
          </Link>
        </li>
        <li>
          <Link to="/gallery" className="hover:text-blue-600">
            Gallery
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-blue-600">
            About
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-blue-600">
            Contact Us
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>
        </li>
        <li>
          <Link to="/signup" className="hover:text-blue-600">
            Sign Up
          </Link>
        </li>
      </ul>
    </div>
  )
}
