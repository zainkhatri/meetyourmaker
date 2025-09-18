import { useState, useEffect } from 'react';
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
import { collection, query, getDocs, where, getDocs as getAllDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import openai from '../config/openai';
import { getPersonaPrompt } from '../config/persona';

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
  const [messagesByMode, setMessagesByMode] = useState<{
    professional: Message[];
    casual: Message[];
  }>({ professional: [], casual: [] });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'professional' | 'casual'>('professional');
  const [styleSamples, setStyleSamples] = useState<WritingSample[]>([]);
  const [knowledgeSamples, setKnowledgeSamples] = useState<WritingSample[]>([]);
  const [identityCard, setIdentityCard] = useState<string>('');
  // Helper for a mode-specific greeting
  const modeGreeting = (m: 'professional' | 'casual') =>
    m === 'professional'
      ? "hello — how can I assist you today?"
      : "hey, what's up! i'm zain";

  // Set a friendly, mode-specific default greeting once on initial mount
  useEffect(() => {
    setMessagesByMode(prev => ({
      ...prev,
      [mode]: prev[mode].length === 0
        ? [{ role: 'assistant', content: modeGreeting(mode) }]
        : prev[mode],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        console.log('Fetching samples for mode:', mode);

        // Helper to safely fetch a collection; returns [] if it doesn't exist
        const safeFetchAll = async (colName: string) => {
          try {
            const snap = await getDocs(collection(db, colName));
            return snap.docs.map(d => ({ id: d.id, ...d.data() })) as WritingSample[];
          } catch (e) {
            console.warn(`Collection ${colName} not found or unreadable`, e);
            return [] as WritingSample[];
          }
        };

        if (mode === 'professional') {
          // Professional: knowledge + style from knowledge_chunks (type=professional)
          const profQ = query(collection(db, 'knowledge_chunks'), where('type', '==', 'professional'));
          const profSnap = await getDocs(profQ);
          const profSamples = profSnap.docs.map(d => ({ id: d.id, ...d.data() })) as WritingSample[];
          setStyleSamples(profSamples);
          setKnowledgeSamples(profSamples);
        } else {
          // Casual: knowledge from both knowledge_chunks and RAW; style from RAW
          const kcAll = await safeFetchAll('knowledge_chunks');
          const rawAll = await safeFetchAll('RAW');
          setKnowledgeSamples([...(kcAll || []), ...(rawAll || [])]);
          setStyleSamples(rawAll || []);
        }


        // Fetch identity card (shared across modes). We take the first doc in 'identity'
        try {
          const idSnap = await getAllDocs(collection(db, 'identity'));
          if (!idSnap.empty) {
            const first = idSnap.docs[0].data() as { bio?: string; name?: string; location?: string; occupation?: string };
            const parts = [first.name, first.occupation, first.location].filter(Boolean).join(' • ');
            const combined = [parts, first.bio].filter(Boolean).join('\n');
            setIdentityCard(combined);
          } else {
            setIdentityCard('');
          }
        } catch (e) {
          console.warn('Identity card not found');
          setIdentityCard('');
        }
      } catch (error) {
        console.error('Error fetching samples:', error);
        setError('Unable to load writing samples. Please try again.');
      }
    };

    fetchSamples();
  }, [mode]);

  // If the user switches modes and there is no real conversation yet, refresh the greeting
  useEffect(() => {
    const msgs = messagesByMode[mode] || [];
    const onlyGreeting = msgs.length === 0 || (msgs.length === 1 && msgs[0].role === 'assistant');
    if (onlyGreeting) {
      setMessagesByMode(prev => ({
        ...prev,
        [mode]: [{ role: 'assistant', content: modeGreeting(mode) }],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, messagesByMode.professional.length, messagesByMode.casual.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setError('');

    setMessagesByMode(prev => ({
      ...prev,
      [mode]: [...(prev[mode] || []), { role: 'user', content: userMessage }],
    }));

    try {
      const styleContext = styleSamples
        .map(sample => `${sample.content}\nContext: ${sample.context}`)
        .join('\n\n');
      const knowledgeContext = knowledgeSamples
        .map(sample => `${sample.content}\nContext: ${sample.context}`)
        .join('\n\n');

      console.log(`Generating response using style=${styleSamples.length}, knowledge=${knowledgeSamples.length} for mode=${mode}`);

      const currentMessages = messagesByMode[mode] || [];
      const styleBlock =
        styleSamples.length > 0
          ? `Here are examples of Zain's ${mode} writing style (MATCH THIS TONE EXACTLY):\n\n${styleContext}\n\nCRITICAL: For casual mode, you MUST write EXACTLY like these examples. Use the same sentence structure, lowercase style, and exact phrases. Examples of Zain's actual casual style:\n- "honestly just vibing today, might hit up the gym later or just chill at home. been a long week but we made it through"\n- "nah i'm good, just working on some side projects. trying to learn this new framework but it's lowkey confusing at first"\n- "I'm doing good! Lowkey it's been kinda boring since all my friends left back to college or got new jobs. I find myself watching a lot of movies, playing tennis nowadays, and trying to make new friends here and there. I miss my college days sometimes. It was fun waffling in Vela with the lads going skitz here and there. I miss just going up to the lads and goin "what's good shorty" to all of them. I miss just being a figure in the community with influence like that. It's not the same post grad. I love interning at NASA though. It's really cool work, and I hope it will make my career go insane. Fire stuff all around."\n- "We went to this Bazaar at the same mosque we do the ghoosals for, it was mid. We went to Qamaria, applied for some jobs, then we hooped at Mube's. It was hella fun, me and Moz had a good 5 game streak. Just when things started to get a little more exciting, I think it's come to a pause. Sab goes back to SD soon, and I think it would be weird if I asked Ceena to hang w/o her. I didn't really touch on this new found liking for Catan. I went to Ladoo's to talk about Breaking Bad. Jesse!"\n\nWrite in this EXACT style - lowercase, natural, using "lwk", "hella", "bro", "mid", "fire", "yapped", "skitz", "waffling" etc. NEVER use "yo" unless it's "yo whats good shorty". NEVER use "mates" - use "lads" instead. NEVER use "bro" randomly - only in context like "bro I want it after the internship". NO profanity.`
          : `There are currently no saved style examples for this mode. Rely strictly on the baseline persona and maintain a ${mode} tone.`;

      const knowledgeBlock =
        knowledgeSamples.length > 0
          ? `Use the following knowledge/context when relevant (do not quote verbatim unless asked):\n\n${knowledgeContext}`
          : '';

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `${getPersonaPrompt(mode)}\n\n${identityCard ? `Identity card (authoritative, do not invent or contradict):\n${identityCard}\n\n` : ''}${styleBlock}\n\n${knowledgeBlock}\n\nCRITICAL RULES - FOLLOW EXACTLY:\n- ONLY use information provided in the knowledge samples and identity card above.\n- If asked about personal details NOT in the samples, say "I don't have that information available."\n- Do NOT invent, assume, or guess any personal details about Zain's activities, hobbies, or interests.\n- Do NOT mention activities like "hitting up the gym" or other things not explicitly stated in the samples.\n- ONLY mention activities, interests, or hobbies that are specifically mentioned in the provided samples.\n- ${mode === 'professional' ? 'Maintain professional tone' : 'For casual mode: Write EXACTLY like the examples provided. Use lowercase, natural sentence structure, and the exact phrases from the samples. Match the tone, energy, and style precisely. Use "lwk", "hella", "bro", "mid", "fire", "yapped", "skitz", "waffling" etc. as shown in the examples. Use "bro" naturally in context like "bro I want it after the internship" not randomly placed. NEVER use "yo" unless it\'s "yo whats good shorty". NEVER use "mates" - use "lads" instead. NO profanity.'}\n- Match the writing style from the examples provided.`
          },
          ...currentMessages.map(msg => ({
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
        setMessagesByMode(prev => ({
          ...prev,
          [mode]: [...(prev[mode] || []), { role: 'assistant', content: aiResponse }],
        }));
      }
    } catch (err) {
      console.error('Error generating response:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        py: 2
      }}>
        <Typography
          sx={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '1.5rem',
            textTransform: 'lowercase',
            letterSpacing: '0.02em'
          }}
        >
          {mode === 'professional' ? 'professional discourse' : 'casual conversation'}
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, newValue) => {
            if (newValue !== null) {
              setMode(newValue);
              setError('');
            }
          }}
          sx={{
            '& .MuiToggleButton-root': {
              fontFamily: 'Georgia, serif',
              color: 'rgba(255,255,255,0.7)',
              borderColor: 'rgba(255,255,255,0.1)',
              px: 3,
              py: 1,
              textTransform: 'lowercase',
              fontSize: '0.9rem',
              letterSpacing: '0.02em',
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
              },
            },
          }}
        >
          <ToggleButton value="professional">
            professional
          </ToggleButton>
          <ToggleButton value="casual">
            casual
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
          {(messagesByMode[mode] || []).map((message, index) => (
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
                composing response...
              </Typography>
            </ListItem>
          )}
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
          placeholder={mode === 'professional' ? 
            "Enter your professional inquiry..." : 
            "What's on your mind?"}
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
            textTransform: 'lowercase',
            borderColor: 'rgba(255,255,255,0.2)',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.4)',
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
          }}
        >
          send
        </Button>
      </Paper>
    </Box>
  );
};

export default ChatInterface;