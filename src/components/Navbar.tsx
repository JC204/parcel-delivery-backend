import { NavLink } from 'react-router-dom';

interface NavbarProps {
  courierId: string | null;
  logout: () => void;
}

const Navbar = ({ courierId, logout }: NavbarProps) => {
  const linkClass =
    'px-4 py-2 text-gray-700 hover:text-blue-600 hover:underline transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const activeClass = 'text-blue-600 font-semibold underline';

  return (
    <nav className="flex items-center space-x-6 bg-white shadow-md py-4 px-6">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
        aria-label="Track parcel"
      >
        Track
      </NavLink>
      <NavLink
        to="/create"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
        aria-label="Create new parcel"
      >
        Create
      </NavLink>
      <NavLink
        to="/catalog"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
        aria-label="View catalog"
      >
        Catalog
      </NavLink>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
        aria-label="Courier dashboard"
      >
        Dashboard
      </NavLink>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Login state */}
      {courierId ? (
        <button
          onClick={logout}
          className="text-red-600 font-semibold hover:underline"
        >
          Logout ({courierId})
        </button>
      ) : (
        <span className="text-gray-500 italic">Not logged in</span>
      )}
    </nav>
  );
};

export default Navbar;