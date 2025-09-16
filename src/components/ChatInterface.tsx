import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  List,
  ListItem,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import openai from '../config/openai';
import { getPersonaPrompt } from '../config/persona';
import SectionHeader from './newspaper/SectionHeader';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface WritingSample {
  id: string;
  content: string;
  context: string;
  type: 'professional' | 'casual';
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'professional' | 'casual'>('casual');
  const [samples, setSamples] = useState<WritingSample[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const samplesQuery = query(
          collection(db, 'knowledge_chunks'),
          where('type', '==', mode)
        );
        const snapshot = await getDocs(samplesQuery);
        const fetchedSamples = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WritingSample[];
        setSamples(fetchedSamples);

        setMessages([{
          role: 'assistant',
          content: mode === 'professional' ? 
            "How may I assist you today?" :
            "Hey! What's on your mind?"
        }]);
      } catch (error) {
        console.error('Error fetching samples:', error);
        setError('Unable to connect. Please try again.');
      }
    };

    fetchSamples();
  }, [mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setError('');

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const context = samples
        .map(sample => `${sample.content}\nContext: ${sample.context}`)
        .join('\n\n');

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `${getPersonaPrompt(mode)}\n\nHere are examples of your ${mode} writing style:\n\n${context}\n\nImportant instructions:\n1. Study these examples carefully - they show your actual ${mode} style\n2. Match the tone, vocabulary, and sentence structure exactly\n3. Keep responses natural and ${mode === 'professional' ? 'professional' : 'conversational'}\n4. Never mention that you're an AI or that you're mimicking a style\n5. Stay true to your baseline identity while responding in your ${mode} style`
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: mode === 'professional' ? 0.7 : 0.8,
      });

      const aiResponse = response.choices[0].message.content;
      if (aiResponse) {
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      }
    } catch (err) {
      console.error('Error generating response:', err);
      setError('Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
      }}>
        <SectionHeader title={mode === 'professional' ? 'Professional Discourse' : 'Casual Conversation'} />
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, newValue) => {
            if (newValue !== null) {
              setMode(newValue);
            }
          }}
          sx={{
            mt: 2,
            '& .MuiToggleButton-root': {
              fontFamily: 'Georgia, serif',
              color: 'rgba(255,255,255,0.7)',
              borderColor: 'rgba(255,255,255,0.1)',
              px: 3,
              py: 1,
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
              },
            },
          }}
        >
          <ToggleButton value="professional">
            Professional
          </ToggleButton>
          <ToggleButton value="casual">
            Casual
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {error && (
        <Typography 
          sx={{ 
            mb: 2, 
            textAlign: 'center',
            fontFamily: 'Georgia, serif',
            color: '#ff6b6b',
            p: 2,
          }}
        >
          {error}
        </Typography>
      )}
      
      <Paper 
        sx={{ 
          height: '50vh', 
          overflow: 'auto',
          backgroundColor: 'transparent',
          mb: 3,
          border: '1px solid rgba(255,255,255,0.1)',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(255,255,255,0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
          },
        }}
      >
        <List sx={{ p: 3 }}>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
                px: 0,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  backgroundColor: message.role === 'user' ? 
                    'rgba(255,255,255,0.05)' : 
                    'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Typography 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Georgia, serif',
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                  }}
                >
                  {message.content}
                </Typography>
              </Paper>
            </ListItem>
          ))}
          {loading && (
            <ListItem sx={{ justifyContent: 'center' }}>
              <Typography 
                sx={{ 
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                }}
              >
                Composing response...
              </Typography>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Paper 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          display: 'flex', 
          gap: 2,
          p: 2,
          backgroundColor: 'transparent',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your inquiry..."
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: 'Georgia, serif',
              backgroundColor: 'rgba(255,255,255,0.05)',
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
            },
          }}
        />
        <Button 
          type="submit" 
          variant="outlined"
          disabled={loading || !input.trim()}
          endIcon={<SendIcon />}
          sx={{
            fontFamily: 'Georgia, serif',
            borderColor: 'rgba(255,255,255,0.2)',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.4)',
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
          }}
        >
          Submit
        </Button>
      </Paper>
    </Box>
  );
};

export default ChatInterface;