import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Box, Button, Avatar } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import Admin from './pages/Admin';
import Headline from './components/newspaper/Headline';
import Column from './components/newspaper/Column';
import Article from './components/newspaper/Article';
import SectionHeader from './components/newspaper/SectionHeader';
import PullQuote from './components/newspaper/PullQuote';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1a1a1a',
    },
  },
});

function App() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          minHeight: '100vh',
          background: '#121212',
          pt: 4,
          pb: 8
        }}>
          <Container maxWidth="lg">
            <Box sx={{ 
              backgroundColor: '#1a1a1a',
              p: 4,
            }}>
              {/* Masthead */}
              <Box sx={{ 
                textAlign: 'center',
                borderBottom: '4px double rgba(255,255,255,0.1)',
                mb: 4,
                pb: 3
              }}>
                <Headline
                  main="meetyourmaker"
                  subheading="chat with zain's digital consciousness"
                  size="large"
                />
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2,
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'Georgia, serif'
                }}>
                  <a 
                    href="https://zainkhatri.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    zainkhatri.com
                  </a>
                  <span>{currentDate}</span>
                  <a 
                    href="https://github.com/zainkhatri" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    @zainkhatri
                  </a>
                </Box>
              </Box>

              <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/" element={
                  <Box sx={{ display: 'flex' }}>
                    {/* Main Content - 3 columns */}
                    <Column width={3}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 3, 
                        mb: 4 
                      }}>
                        <Avatar 
                          src="https://avatars.githubusercontent.com/u/zainkhatri" 
                          sx={{ 
                            width: 120, 
                            height: 120,
                            border: '3px solid rgba(255,255,255,0.1)'
                          }}
                        />
                        <Box>
                          <Headline
                            main="Chat with Zain's AI"
                            subheading="UCSD Alumni • Software & ML Engineer • NASA Researcher"
                            size="medium"
                          />
                        </Box>
                      </Box>
                      <Article
                        content="Experience direct communication with an AI system trained on Zain Khatri's writing style and thought patterns. This unique interface allows you to interact with a digital consciousness that mirrors Zain's communication style, whether in professional contexts or casual conversations. As a Software Engineer and Machine Learning researcher who's worked at NASA Ames, Zain's digital echo maintains his technical expertise while preserving his personal voice."
                        byline="Digital Consciousness Interface"
                        date={currentDate}
                      />
                      <Box sx={{ mb: 4 }}>
                        <ChatInterface />
                      </Box>
                    </Column>

                    {/* Sidebar - 1 column */}
                    <Column width={1} withDivider={false}>
                      <SectionHeader title="About Zain" />
                      <PullQuote
                        quote="A UCSD graduate with a focus in Machine Learning and Cognitive Science, bringing technical expertise from NASA and a passion for innovative AI solutions."
                        attribution="Background"
                      />
                      <Article
                        content="The system maintains Zain's dual communication modes: his professional voice honed through research and engineering work, and his casual tone from everyday interactions. Each response is crafted to authentically represent his communication style, creating a genuine digital extension of his personality."
                        byline="System Architecture"
                      />
                      <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button
                          component={Link}
                          to={window.location.pathname === '/admin' ? '/' : '/admin'}
                          variant="outlined"
                          sx={{
                            fontFamily: 'Georgia, serif',
                            textTransform: 'none',
                          }}
                        >
                          {window.location.pathname === '/admin' ? 'return to chat' : 'configure system'}
                        </Button>
                      </Box>
                    </Column>
                  </Box>
                } />
              </Routes>
            </Box>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;