import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Calendar, 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu,
  X,
  Moon,
  Sun,
  Shield,
  FileText,
  Sparkles,
  Crown,
  BadgeCheck,
  Star
} from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Navigation items based on user role
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/events', label: 'Événements', icon: Calendar },
    { path: '/participants', label: 'Participants', icon: Users },
  ];

  // Add Registrations management for admin and staff
  if (user?.role === 'admin' || user?.role === 'staff') {
    navItems.push({ path: '/registrations', label: 'Inscriptions', icon: FileText });
  }

  // Add Users management only for admin
  if (user?.role === 'admin') {
    navItems.push({ path: '/users', label: 'Utilisateurs', icon: Shield });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <nav className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-50 shadow-lg shadow-gray-900/5 dark:shadow-black/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-3 group relative">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/30 group-hover:shadow-2xl group-hover:shadow-primary-500/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent group-hover:from-primary-600 group-hover:via-primary-700 group-hover:to-primary-800 dark:group-hover:from-primary-400 dark:group-hover:via-primary-300 dark:group-hover:to-primary-400 transition-all duration-300">
                    EventHub
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Gestion d'événements</p>
                </div>
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  const isAdminPage = item.path === '/users' && user?.role === 'admin';
                  const isStaffPage = (item.path === '/registrations' || item.path === '/events') && user?.role === 'staff';
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group relative inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                        active
                          ? user?.role === 'admin' && isAdminPage
                            ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white shadow-lg shadow-red-500/30 dark:shadow-red-500/20'
                            : user?.role === 'staff' && isStaffPage
                            ? 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30 dark:shadow-primary-500/20'
                            : 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30 dark:shadow-primary-500/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-slate-700/80 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {active && (
                        <>
                          <div className={`absolute inset-0 bg-gradient-to-r rounded-xl animate-pulse ${
                            user?.role === 'admin' && isAdminPage
                              ? 'from-red-400/20 to-transparent'
                              : 'from-primary-400/20 to-transparent'
                          }`}></div>
                          <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity ${
                            user?.role === 'admin' && isAdminPage
                              ? 'from-red-400/30 via-red-500/30 to-red-600/30'
                              : 'from-primary-400/30 via-primary-500/30 to-primary-600/30'
                          }`}></div>
                        </>
                      )}
                      <Icon className={`w-5 h-5 mr-2 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'} ${
                        isAdminPage ? 'text-yellow-300' : 
                        isStaffPage && active ? 'text-blue-200' : ''
                      }`} />
                      <span className="relative z-10">{item.label}</span>
                      {isAdminPage && active && (
                        <Crown className="w-3.5 h-3.5 ml-1.5 text-yellow-300 animate-pulse" />
                      )}
                      {isStaffPage && active && (
                        <BadgeCheck className="w-3.5 h-3.5 ml-1.5 text-blue-200 animate-pulse" />
                      )}
                      {active && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-white/50 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-110 hover:rotate-12 relative group"
                aria-label="Toggle theme"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 relative z-10 group-hover:text-yellow-500 transition-colors" />
                ) : (
                  <Moon className="w-5 h-5 relative z-10 group-hover:text-primary-500 transition-colors" />
                )}
              </button>
              <div className="hidden sm:flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-slate-700/80 dark:to-slate-800/80 rounded-xl border border-gray-200/50 dark:border-slate-600/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg transition-all duration-300 group-hover:scale-110 ${
                    user?.role === 'admin' 
                      ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-red-500/40' 
                      : 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-primary-500/40'
                  }`}>
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {user?.role === 'admin' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                      <Crown className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  {user?.role === 'staff' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center">
                    {user?.fullName}
                    {user?.role === 'admin' && (
                      <Sparkles className="w-3 h-3 ml-1.5 text-yellow-500 animate-pulse" />
                    )}
                    {user?.role === 'staff' && (
                      <Sparkles className="w-3 h-3 ml-1.5 text-primary-500 animate-pulse" />
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize font-semibold flex items-center">
                    {user?.role === 'admin' ? (
                      <>
                        <Shield className="w-3 h-3 mr-1 text-red-500" />
                        Administrateur
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="w-3 h-3 mr-1 text-primary-500" />
                        Personnel
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                const isAdminPage = item.path === '/users' && user?.role === 'admin';
                const isStaffPage = (item.path === '/registrations' || item.path === '/events') && user?.role === 'staff';
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      active
                        ? user?.role === 'admin' && isAdminPage
                          ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                          : 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${
                      isAdminPage ? 'text-yellow-300' : 
                      isStaffPage && active ? 'text-blue-200' : ''
                    }`} />
                    {item.label}
                    {isAdminPage && active && (
                      <Crown className="w-4 h-4 ml-auto text-yellow-300 animate-pulse" />
                    )}
                    {isStaffPage && active && (
                      <BadgeCheck className="w-4 h-4 ml-auto text-blue-200 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
