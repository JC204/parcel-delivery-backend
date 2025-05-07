import { NavLink } from 'react-router-dom';

interface NavbarProps {
  courierId: string | null;
  customerId: string | null;
  courierLogout: () => void;
  customerLogout: () => void;
}

const Navbar = ({
  courierId,
  customerId,
  courierLogout,
  customerLogout,
}: NavbarProps) => {
  const linkClass =
    'px-4 py-2 text-gray-700 hover:text-blue-600 hover:underline transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const activeClass = 'text-blue-600 font-semibold underline';

  return (
    <nav
      role="navigation"
      className="flex items-center space-x-6 bg-white shadow-md py-4 px-6"
    >
      {/* Home */}
      <NavLink
        to="/"
        title="Home"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
        aria-label="Home"
      >
        Home
      </NavLink>

      {/* Track */}
      <NavLink
        to="/track"
        title="Track parcel"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
        aria-label="Track parcel"
      >
        Track
      </NavLink>

      {/* Create */}
      <NavLink
        to="/create"
        title="Create new parcel"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
        aria-label="Create new parcel"
      >
        Create
      </NavLink>

      {/* Catalog */}
      <NavLink
        to="/catalog"
        title="View catalog"
        className={({ isActive }) =>
          isActive ? `${linkClass} ${activeClass}` : linkClass
        }
        aria-label="View catalog"
      >
        Catalog
      </NavLink>

      {/* Courier Dashboard */}
      {courierId && (
        <NavLink
          to="/dashboard"
          title="Courier dashboard"
          className={({ isActive }) =>
            isActive ? `${linkClass} ${activeClass}` : linkClass
          }
          aria-label="Courier dashboard"
        >
          Dashboard
        </NavLink>
      )}

      {/* Customer Dashboard */}
      {customerId && (
        <NavLink
          to="/customer"
          title="Customer dashboard"
          className={({ isActive }) =>
            isActive ? `${linkClass} ${activeClass}` : linkClass
          }
          aria-label="Customer dashboard"
        >
          My Parcels
        </NavLink>
      )}

      {/* Customer Login */}
      {!customerId && (
        <NavLink
          to="/customer-login"
          title="Customer login"
          className={({ isActive }) =>
            isActive ? `${linkClass} ${activeClass}` : linkClass
          }
          aria-label="Customer login"
        >
          Customer Login
        </NavLink>
      )}

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Login State Display */}
      {courierId && (
        <button
          onClick={courierLogout}
          title={`Logout as courier ${courierId}`}
          className="text-red-600 font-semibold hover:underline"
        >
          Logout (Courier: {courierId})
        </button>
      )}
      {customerId && !courierId && (
        <button
          onClick={customerLogout}
          title={`Logout as customer ${customerId}`}
          className="text-red-600 font-semibold hover:underline"
        >
          Logout (Customer: {customerId})
        </button>
      )}
      {!courierId && !customerId && (
        <span className="text-gray-500 italic">Not logged in</span>
      )}
    </nav>
  );
};

export default Navbar;