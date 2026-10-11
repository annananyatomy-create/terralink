import express from 'express';
import dotenv from 'dotenv';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  getUserProfile,
  getActivities,
  addActivity,
  getCommunityGoals,
  getCommunityFeed,
} from './src/db/queries.ts';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API: Get Current User Profile from Cloud SQL
app.get('/api/user', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid || 'usr-alex-chen';
    const profile = await getUserProfile(uid);
    res.json(profile);
  } catch (error: any) {
    console.error('Error in /api/user:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch user profile' });
  }
});

// API: Get Activities from Cloud SQL
app.get('/api/activities', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid || 'usr-alex-chen';
    const profile = await getUserProfile(uid);
    const userActivities = await getActivities(profile.id);
    res.json(userActivities);
  } catch (error: any) {
    console.error('Error in /api/activities:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch activities' });
  }
});

// API: Record New Carbon Activity into Cloud SQL
app.post('/api/activities', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid || 'usr-alex-chen';
    const profile = await getUserProfile(uid);
    const {
      category,
      title,
      description,
      emittedKg,
      baselineKg,
      savedKg,
      xpEarned,
      mode,
      distanceKm,
    } = req.body;

    const recorded = await addActivity({
      userId: profile.id,
      category,
      title,
      description,
      emittedKg: Number(emittedKg) || 0,
      baselineKg: Number(baselineKg) || 0,
      savedKg: Number(savedKg) || 0,
      xpEarned: Number(xpEarned) || 20,
      mode,
      distanceKm: distanceKm ? Number(distanceKm) : undefined,
    });

    res.status(201).json(recorded);
  } catch (error: any) {
    console.error('Error in POST /api/activities:', error);
    res.status(500).json({ error: error.message || 'Failed to record activity' });
  }
});

// API: Get Community Goals from Cloud SQL
app.get('/api/community-goals', async (_req, res) => {
  try {
    const goals = await getCommunityGoals();
    res.json(goals);
  } catch (error: any) {
    console.error('Error in /api/community-goals:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch community goals' });
  }
});

// API: Get Community Feed from Cloud SQL
app.get('/api/community-feed', async (_req, res) => {
  try {
    const feed = await getCommunityFeed();
    res.json(feed);
  } catch (error: any) {
    console.error('Error in /api/community-feed:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch community feed' });
  }
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: Number(port) },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(port, () => {
    console.log(`Terralink SQL full-stack server running on port ${port}`);
  });
}

startServer();
