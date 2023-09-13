import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import CreateCustomer from 'views/Customer/CreateCustomer';
import CreateFamilyMembers from 'views/FamilyMembers/CreateFamilyMembers';
import GetPackages from 'views/Packages/GetPackages';
import CreatePackage from 'views/Packages/CreatePackage';
import Bookings from 'views/Booking/GetBookings';
import CreateBooking from 'views/Booking/CreateBooking';
// import GetFamilyMemers from 'views/FamilyMembers/GetFamilymembers';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Customers = Loadable(lazy(() => import('views/Customer/Customers')));
const GetFamilyMembers = Loadable(lazy(() => import('views/FamilyMembers/GetFamilyMembers')));

// sample page routing

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: '/customers',
      element: <Customers />
    },
    {
      path: '/createCustomer',
      element: <CreateCustomer />
    },
    {
      path: '/familyMembers',
      element: <GetFamilyMembers />
    },
    {
      path: '/CreatefamilyMembers',
      element: <CreateFamilyMembers />
    },
    {
      path: '/Packages',
      element: <GetPackages />
    },
    {
      path: '/createPackage',
      element: <CreatePackage />
    },

    {
      path: '/Bookings',
      element: <Bookings />
    },
    {
      path: '/createBooking',
      element: <CreateBooking />
    }
  ]
};

export default MainRoutes;
