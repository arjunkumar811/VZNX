import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">V</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">VZNX Manager</h1>
            </div>
            <div className="hidden sm:ml-12 sm:flex sm:space-x-4">
              <Link
                to="/"
                className={`${
                  isActive('/')
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                } inline-flex items-center px-6 py-2 rounded-lg text-lg font-semibold transition-all`}
              >
                📊 Projects
              </Link>
              <Link
                to="/team"
                className={`${
                  isActive('/team')
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                } inline-flex items-center px-6 py-2 rounded-lg text-lg font-semibold transition-all`}
              >
                👥 Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
