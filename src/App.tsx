import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Button, Avatar, Typography, Divider } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import Admin from './pages/Admin';
import Headline from './components/newspaper/Headline';
import Column from './components/newspaper/Column';
import Article from './components/newspaper/Article';
import SectionHeader from './components/newspaper/SectionHeader';
import PullQuote from './components/newspaper/PullQuote';
import PhotoStory from './components/newspaper/PhotoStory';
import { analytics } from './config/firebase';

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
          pb: 8,
          px: { xs: 2, sm: 3, md: 4 }
        }}>
          <Box sx={{ 
            backgroundColor: '#1a1a1a',
            width: '100%',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 10px)'
            }
          }}>
            {/* Newspaper Header */}
            <Box sx={{ 
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: '#161616'
            }}>
              <Box sx={{ 
                textAlign: 'center', 
                pt: 4,
                px: { xs: 2, sm: 3, md: 4 },
              }}>
                <Typography 
                  sx={{ 
                    fontSize: '0.8rem',
                    letterSpacing: '0.2em',
                    color: 'rgba(255,255,255,0.6)',
                    mb: 1,
                    fontFamily: 'Georgia, serif',
                    textTransform: 'uppercase'
                  }}
                >
                  established 2025 • vol. 1 • no. 1
                </Typography>
                
                <Box sx={{ 
                  borderBottom: '4px double rgba(255,255,255,0.1)',
                  borderTop: '4px double rgba(255,255,255,0.1)',
                  py: 3,
                  my: 2
                }}>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: { xs: '3rem', md: '4.5rem' },
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      mb: 2,
                      textTransform: 'lowercase'
                    }}
                  >
                    meetyourmaker
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '1.2rem',
                      fontStyle: 'italic',
                      color: 'rgba(255,255,255,0.7)',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      py: 1,
                      mx: 'auto',
                      maxWidth: '600px'
                    }}
                  >
                    chat with zain
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  pb: 2,
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'Georgia, serif'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    '& > a': {
                      color: 'inherit',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      letterSpacing: '0.05em',
                      fontStyle: 'italic',
                      '&:hover': {
                        color: 'white'
                      }
                    }
                  }}>
                    <a href="https://zainkhatri.com" target="_blank" rel="noopener noreferrer">
                      zainkhatri.com
                    </a>
                    <span>•</span>
                    <a href="https://github.com/zainkhatri" target="_blank" rel="noopener noreferrer">
                      @zainkhatri
                    </a>
                  </Box>
                  <Typography 
                    sx={{ 
                      fontStyle: 'italic',
                      fontSize: '0.9rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {currentDate}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/" element={
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 4, md: 0 }
                  }}>
                    {/* Main Column */}
                    <Column width={3}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: { xs: 'center', md: 'flex-start' },
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 3, 
                        mb: 4,
                        borderBottom: '2px solid rgba(255,255,255,0.1)',
                        pb: 4
                      }}>
                        <Avatar 
                          src="/hero.JPG" 
                          sx={{ 
                            width: { xs: 100, md: 120 }, 
                            height: { xs: 100, md: 120 },
                            border: '3px solid rgba(255,255,255,0.1)'
                          }}
                        />
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                          <Typography
                            sx={{
                              fontFamily: 'Playfair Display, Georgia, serif',
                              fontSize: '2rem',
                              fontWeight: 700,
                              mb: 1,
                              textTransform: 'lowercase'
                            }}
                          >
                            zain khatri
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'Georgia, serif',
                              fontSize: '1rem',
                              color: 'rgba(255,255,255,0.7)',
                              fontStyle: 'italic'
                            }}
                          >
                            ucsd alumni • software & ml engineer • nasa researcher
                          </Typography>
                        </Box>
                      </Box>
                      <Article
                        content="Experience direct communication with an AI system trained on Zain Khatri's writing style and thought patterns. This unique interface allows you to interact with a digital consciousness that mirrors Zain's communication style, whether in professional contexts or casual conversations. As a Software Engineer and Machine Learning researcher who's worked at NASA Ames, Zain's digital echo maintains his technical expertise while preserving his personal voice."
                        byline="author: zain khatri"
                        date={currentDate}
                      />
                      <Box sx={{ mb: 4 }}>
                        <ChatInterface />
                      </Box>
                    </Column>

                    {/* Sidebar */}
                    <Column width={1} withDivider={false}>
                      <Box sx={{
                        border: '1px solid rgba(255,255,255,0.1)',
                        p: 3,
                        backgroundColor: 'rgba(26,26,26,0.5)',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 5px)'
                        }
                      }}>
                        <SectionHeader title="about zain" />
                        <PullQuote
                          quote="you may be asking, why would i want to talk to zain when it's not zain? that's a good point. if i'm being honest, i just wanted to talk to myself and see if the response was accurate or not :)"
                          attribution="zain"
                        />
                        <Divider sx={{ 
                          my: 3, 
                          borderStyle: 'dashed',
                          borderColor: 'rgba(255,255,255,0.1)' 
                        }} />
                        <Article
                          content="The system maintains Zain's dual communication modes: his professional voice honed through research and engineering work, and his casual tone from everyday interactions. Each response is crafted to authentically represent his communication style, creating a genuine digital extension of his personality."
                          byline="system architecture"
                        />
                        <Divider sx={{ 
                          my: 3, 
                          borderStyle: 'dashed',
                          borderColor: 'rgba(255,255,255,0.1)' 
                        }} />
                        <SectionHeader title="in pictures" />
                        <PhotoStory 
                          images={[
                            {
                              src: "/1.JPG",
                              caption: "graduation day at university of california san diego, studying cognitive science and machine learning",
                              width: "full"
                            },
                            {
                              src: "/2.JPG",
                              caption: "zain khatri (left) with colleague at muslim tech collaborative, a club he founded",
                              width: "half"
                            },
                            {
                              src: "/3.JPG",
                              caption: "nasa ames research center, where zain works on ai and robotics",
                              width: "half"
                            },
                            {
                              src: "/4.JPG",
                              caption: "sunset in evergreen, the hometown where it all began",
                              width: "full"
                            }
                          ]} 
                        />
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                          <Button
                            component={Link}
                            to={window.location.pathname === '/admin' ? '/' : '/admin'}
                            variant="outlined"
                            sx={{
                              fontFamily: 'Georgia, serif',
                              textTransform: 'none',
                              borderColor: 'rgba(255,255,255,0.2)',
                              borderStyle: 'double',
                              borderWidth: '3px',
                              '&:hover': {
                                borderColor: 'rgba(255,255,255,0.4)',
                                backgroundColor: 'rgba(255,255,255,0.05)'
                              }
                            }}
                          >
                            {window.location.pathname === '/admin' ? 'return to chat' : 'configure system'}
                          </Button>
                        </Box>
                      </Box>
                    </Column>
                  </Box>
                } />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;