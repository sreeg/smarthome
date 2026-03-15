import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import DashboardApp from './pages/DashboardApp';
import Drawing from './pages/Drawing';
import Office from './pages/Office';
import Balcony from './pages/Balcony';
import Bedroom from './pages/Bedroom';
import Kids from './pages/Kids';
import Kitchen from './pages/Kitchen';
import Living from './pages/Living';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'drawing', element: <Drawing /> },
        { path: 'living', element: <Living /> },
        { path: 'bedroom', element: <Bedroom /> },
        { path: 'balcony', element: <Balcony /> },
        { path: 'kids', element: <Kids /> },
        { path: 'office', element: <Office /> },
        { path: 'kitchen', element: <Kitchen /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}