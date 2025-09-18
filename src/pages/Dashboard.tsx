import { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface WritingSample {
  id: string;
  content: string;
  category: string;
  created_at: string;
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [samples, setSamples] = useState<WritingSample[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const fetchSamples = async () => {
      try {
        const q = query(
          collection(db, 'writing_samples'),
          where('user_id', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const samplesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WritingSample[];
        setSamples(samplesData);
      } catch (error) {
        console.error('Error fetching samples:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, [currentUser, navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Your Writing Dashboard
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/analysis')}
                sx={{ mr: 2 }}
              >
                Analyze New Writing
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/generate')}
              >
                Generate Text
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Recent Writing Samples
            </Typography>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : samples.length > 0 ? (
              samples.map((sample) => (
                <Paper key={sample.id} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" color="primary">
                    {sample.category}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {sample.content.substring(0, 200)}...
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Added on: {new Date(sample.created_at).toLocaleDateString()}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Typography>
                No writing samples yet. Start by analyzing some of your writing!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;




