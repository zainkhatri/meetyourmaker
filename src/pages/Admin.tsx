import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Tabs,
  Tab
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { persona } from '../config/persona';

interface WritingSample {
  id: string;
  content: string;
  context: string;
  category: string;
  type: 'professional' | 'casual';
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [samples, setSamples] = useState<WritingSample[]>([]);
  const [content, setContent] = useState('');
  const [context, setContext] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'professional' | 'casual'>('professional');
  const [viewType, setViewType] = useState<'professional' | 'casual'>('professional');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' as 'success' | 'error' });
  const [showNotification, setShowNotification] = useState(false);
  
  // Identity card state
  const [identityCard, setIdentityCard] = useState({
    name: '',
    occupation: '',
    location: '',
    bio: ''
  });

  useEffect(() => {
    if (activeTab === 0) {
      fetchSamples();
    } else if (activeTab === 2) {
      fetchIdentityCard();
    }
  }, [viewType, activeTab]);

  const fetchIdentityCard = async () => {
    try {
      const idSnap = await getDocs(collection(db, 'identity'));
      if (!idSnap.empty) {
        const first = idSnap.docs[0].data();
        setIdentityCard({
          name: first.name || '',
          occupation: first.occupation || '',
          location: first.location || '',
          bio: first.bio || ''
        });
      }
    } catch (error) {
      console.error('Error fetching identity card:', error);
    }
  };

  const saveIdentityCard = async () => {
    try {
      await setDoc(doc(db, 'identity', 'main'), identityCard);
      showNotificationMessage('Identity card saved successfully', 'success');
    } catch (error) {
      console.error('Error saving identity card:', error);
      showNotificationMessage('Error saving identity card', 'error');
    }
  };

  const fetchSamples = async () => {
    try {
      const q = query(
        collection(db, 'knowledge_chunks'),
        where('type', '==', viewType)
      );
      const querySnapshot = await getDocs(q);
      const fetchedSamples = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WritingSample[];
      setSamples(fetchedSamples);
    } catch (error) {
      console.error('Error fetching samples:', error);
      showNotificationMessage('Error fetching samples', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        content,
        context,
        category,
        type,
        created_at: new Date().toISOString()
      };

      if (editingId) {
        await updateDoc(doc(db, 'knowledge_chunks', editingId), {
          ...data,
          updated_at: new Date().toISOString()
        });
        showNotificationMessage('Sample updated successfully', 'success');
      } else {
        await addDoc(collection(db, 'knowledge_chunks'), data);
        showNotificationMessage('Sample added successfully', 'success');
      }
      
      clearForm();
      fetchSamples();
    } catch (error) {
      console.error('Error saving sample:', error);
      showNotificationMessage('Error saving sample', 'error');
    }
  };

  const handleEdit = (sample: WritingSample) => {
    setContent(sample.content);
    setContext(sample.context);
    setCategory(sample.category);
    setType(sample.type);
    setEditingId(sample.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'knowledge_chunks', id));
      showNotificationMessage('Sample deleted successfully', 'success');
      fetchSamples();
    } catch (error) {
      console.error('Error deleting sample:', error);
      showNotificationMessage('Error deleting sample', 'error');
    }
  };

  const clearForm = () => {
    setContent('');
    setContext('');
    setCategory('');
    setEditingId(null);
  };

  const showNotificationMessage = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setShowNotification(true);
  };

  const renderPersonaSection = () => {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your Baseline Identity
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This information helps the AI maintain consistency about who you are.
          Edit this in src/config/persona.ts
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography>Name: {persona.basics.name}</Typography>
            <Typography>Age: {persona.basics.age}</Typography>
            <Typography>Location: {persona.basics.location}</Typography>
            <Typography>Occupation: {persona.basics.occupation}</Typography>
          </Box>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Background
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography>Education:</Typography>
            <ul>
              {persona.background.education.map((edu, i) => (
                <li key={i}>{edu.value} - {edu.context}</li>
              ))}
            </ul>
          </Box>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Interests & Knowledge
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography>Current Interests:</Typography>
            <ul>
              {persona.interests.current.map((interest, i) => (
                <li key={i}>{interest}</li>
              ))}
            </ul>

            <Typography sx={{ mt: 2 }}>Areas of Expertise:</Typography>
            <ul>
              {persona.knowledge.expertise.map((exp, i) => (
                <li key={i}>{exp.value} - {exp.context}</li>
              ))}
            </ul>
          </Box>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Communication Style
          </Typography>
          <Box sx={{ ml: 2 }}>
            <ul>
              {persona.characteristics.speaking_style.map((style, i) => (
                <li key={i}>{style}</li>
              ))}
            </ul>
          </Box>
        </Paper>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Digital Identity Configuration
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Writing Samples" />
            <Tab label="Persona Configuration" />
            <Tab label="Identity Card" />
          </Tabs>
        </Box>

        {activeTab === 0 ? (
          <>
            <Box sx={{ mb: 4 }}>
              <ToggleButtonGroup
                value={viewType}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    setViewType(newValue);
                    setType(newValue);
                  }
                }}
                aria-label="content type"
                sx={{ mb: 2 }}
              >
                <ToggleButton value="professional">
                  Professional Writing
                </ToggleButton>
                <ToggleButton value="casual">
                  Casual Talk
                </ToggleButton>
              </ToggleButtonGroup>
              
              <Typography variant="subtitle1" color="text.secondary">
                {viewType === 'professional' ? 
                  'Manage your professional writing samples (cover letters, formal communication)' :
                  'Manage your casual conversation samples (how you naturally speak)'}
              </Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {editingId ? 'Edit Sample' : 'Add New Sample'}
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  margin="normal"
                  required
                  placeholder={type === 'professional' ? 
                    "e.g., Cover Letter, Technical Writing" :
                    "e.g., Casual Chat, Social Media"}
                />
                <TextField
                  fullWidth
                  label="Content"
                  multiline
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  margin="normal"
                  required
                  placeholder={type === 'professional' ?
                    "Your professional writing sample..." :
                    "How you'd say this casually..."}
                />
                <TextField
                  fullWidth
                  label="Context"
                  multiline
                  rows={2}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  margin="normal"
                  required
                  placeholder={type === 'professional' ?
                    "When/where this was written, target audience..." :
                    "Situation, mood, who you were talking to..."}
                />
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {editingId ? 'Update Sample' : 'Add Sample'}
                  </Button>
                  {editingId && (
                    <Button
                      variant="outlined"
                      onClick={clearForm}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </form>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {viewType === 'professional' ? 'Professional Samples' : 'Casual Samples'}
              </Typography>
              <List>
                {samples.map((sample, index) => (
                  <Box key={sample.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        py: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                        <Typography variant="subtitle1" color="primary">
                          {sample.category}
                        </Typography>
                        <Box>
                          <IconButton onClick={() => handleEdit(sample)} size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(sample.id)} size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body1" gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
                        {sample.content}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Context: {sample.context}
                      </Typography>
                    </ListItem>
                  </Box>
                ))}
                {samples.length === 0 && (
                  <Typography color="text.secondary" sx={{ p: 2 }}>
                    No {viewType} samples added yet.
                  </Typography>
                )}
              </List>
            </Paper>
          </>
        ) : activeTab === 1 ? (
          renderPersonaSection()
        ) : (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Identity Card
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This is the authoritative information about you that the AI will use. Keep it concise and factual.
            </Typography>

            <Paper sx={{ p: 3 }}>
              <TextField
                fullWidth
                label="Name"
                value={identityCard.name}
                onChange={(e) => setIdentityCard(prev => ({ ...prev, name: e.target.value }))}
                margin="normal"
                placeholder="e.g., Zain Khatri"
              />
              <TextField
                fullWidth
                label="Occupation"
                value={identityCard.occupation}
                onChange={(e) => setIdentityCard(prev => ({ ...prev, occupation: e.target.value }))}
                margin="normal"
                placeholder="e.g., Software Engineer at NASA"
              />
              <TextField
                fullWidth
                label="Location"
                value={identityCard.location}
                onChange={(e) => setIdentityCard(prev => ({ ...prev, location: e.target.value }))}
                margin="normal"
                placeholder="e.g., San Francisco, CA"
              />
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={identityCard.bio}
                onChange={(e) => setIdentityCard(prev => ({ ...prev, bio: e.target.value }))}
                margin="normal"
                placeholder="Brief description about yourself..."
              />
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveIdentityCard}
                >
                  Save Identity Card
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>

      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
      >
        <Alert
          onClose={() => setShowNotification(false)}
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin;