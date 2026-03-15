// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { Notifications } from 'react-push-notification';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <Notifications />
      <ScrollToTop />
      <GlobalStyles />
      <Router />
    </ThemeConfig>
  );
}
