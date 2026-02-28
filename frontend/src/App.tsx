import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CycleLog from './pages/CycleLog';
import Reminders from './pages/Reminders';
import Education from './pages/Education';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import Intimacy from './pages/Intimacy';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const cycleLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/log',
  component: CycleLog,
});

const remindersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reminders',
  component: Reminders,
});

const intimacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/intimacy',
  component: Intimacy,
});

const educationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/education',
  component: Education,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  dashboardRoute,
  cycleLogRoute,
  remindersRoute,
  intimacyRoute,
  educationRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
