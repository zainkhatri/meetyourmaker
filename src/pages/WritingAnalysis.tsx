import { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import openai from '../config/openai';

const WritingAnalysis = () => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const analyzeWritingStyle = async (text: string) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert writing analyst. Analyze the following text and identify key characteristics of the writing style, including tone, vocabulary level, sentence structure, and unique patterns."
          },
          {
            role: "user",
            content: text
          }
        ]
      });

      const analysis = response.choices[0].message.content;
      
      // Store the analysis characteristics
      await addDoc(collection(db, 'style_characteristics'), {
        characteristic_name: 'style_analysis',
        characteristic_value: analysis,
        created_at: new Date().toISOString()
      });

      return analysis;
    } catch (error) {
      console.error('Error analyzing writing style:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Store the writing sample
      await addDoc(collection(db, 'writing_samples'), {
        content,
        category,
        created_at: new Date().toISOString()
      });

      // Analyze the writing style
      await analyzeWritingStyle(content);

      setSuccess('Writing sample saved and analyzed successfully!');
      setContent('');
      setCategory('');
    } catch (err) {
      setError('Failed to save and analyze writing sample');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {success && (
        <Typography color="success.main" sx={{ mb: 2 }}>
          {success}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Your Writing"
          multiline
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          required
          placeholder="Paste your writing sample here..."
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            'Analyze Writing'
          )}
        </Button>
      </form>
    </Box>
  );
};

export default WritingAnalysis;