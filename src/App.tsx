import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import {
  Hero,
  Navigation,
  PasswordGate,
  Welcome,
  Schedule,
  Venues,
  Travel,
  Lodging,
  Destination,
  Contact,
  Footer,
} from './components';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <PasswordGate>
        <Navigation />
        <main>
          <Hero />
          <Welcome />
          <Schedule />
          <Venues />
          <Travel />
          <Lodging />
          <Destination />
          <Contact />
          <Footer />
        </main>
      </PasswordGate>
    </ThemeProvider>
  );
}

export default App;
