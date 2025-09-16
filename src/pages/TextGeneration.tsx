import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, CircularProgress, Paper } from '@mui/material';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import openai from '../config/openai';

interface StyleCharacteristic {
  characteristic_name: string;
  characteristic_value: string;
}

const TextGeneration = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [styleCharacteristics, setStyleCharacteristics] = useState<StyleCharacteristic[]>([]);

  useEffect(() => {
    const fetchStyleCharacteristics = async () => {
      try {
        const q = query(collection(db, 'style_characteristics'));
        const querySnapshot = await getDocs(q);
        const characteristics = querySnapshot.docs.map(doc => doc.data() as StyleCharacteristic);
        setStyleCharacteristics(characteristics);
      } catch (error) {
        console.error('Error fetching style characteristics:', error);
      }
    };

    fetchStyleCharacteristics();
  }, []);

  const generateText = async () => {
    if (styleCharacteristics.length === 0) {
      setError('Please analyze some writing samples first to establish your style.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedText('');

    try {
      // Combine all style characteristics into a single prompt
      const styleDescription = styleCharacteristics
        .map(char => char.characteristic_value)
        .join('\n');

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a writing assistant that mimics the following writing style:\n${styleDescription}\n\nGenerate text that matches this style exactly.`
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const generatedContent = response.choices[0].message.content || '';
      setGeneratedText(generatedContent);

      // Store the generated content
      await addDoc(collection(db, 'generated_content'), {
        prompt,
        generated_text: generatedContent,
        created_at: new Date().toISOString()
      });

    } catch (err) {
      setError('Failed to generate text');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {styleCharacteristics.length === 0 && (
        <Typography color="warning.main" sx={{ mb: 3 }}>
          Please submit some writing samples first to analyze your style.
        </Typography>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        fullWidth
        label="What would you like to write about?"
        multiline
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        margin="normal"
        required
        placeholder="Enter your topic or prompt here..."
      />

      <Button
        onClick={generateText}
        variant="contained"
        fullWidth
        disabled={loading || styleCharacteristics.length === 0}
        sx={{ mt: 2, mb: 3 }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          'Generate Text'
        )}
      </Button>

      {generatedText && (
        <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
          <Typography variant="h6" gutterBottom>
            Generated Text:
          </Typography>
          <Typography variant="body1">
            {generatedText}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TextGeneration;