const express = require('express');
const supabase = require('../config/supabase');
const authService = require('../services/authService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Auth information for frontend
router.get('/info', (req, res) => {
  res.json({
    message: 'This API uses Supabase Authentication',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    instructions: 'Use Supabase Auth dirwewaeectly in your frontend application'
  });
});

// Register new user (redirect to Supabase Auth)
router.get('/register', (req, res) => {
  res.json({
    message: 'Registration handled by Supabase Auth',
    supabase: true,
    instructions: 'Frontend should call supabase.auth.signUp() directly'
  });
});

router.post('/register', async (req, res) => {
  try {
    // For API compatibility - tell frontend to use Supabase Auth directly
    res.json({
      message: 'Use Supabase Auth for registration',
      supabase: true,
      instructions: 'Frontend should call supabase.auth.signUp() directly'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user (redirect to Supabase Auth)
router.post('/login', async (req, res) => {
  try {
    // For API compatibility - tell frontend to use Supabase Auth directly
    res.json({
      message: 'Use Supabase Auth for login',
      supabase: true,
      instructions: 'Frontend should call supabase.auth.signInWithPassword() directly'
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Supabase Auth callback - create/update user profile
router.post('/callback', async (req, res) => {
  try {
    console.log('Auth callback received:', { user: req.body.user?.id, session: !!req.body.session });

    const { user, session } = req.body;

    if (!user) {
      console.log('Auth callback: No user data provided');
      return res.status(400).json({ message: 'User data required' });
    }

    if (!user.id || !user.email) {
      console.log('Auth callback: Missing user id or email', { id: user.id, email: user.email });
      return res.status(400).json({ message: 'User ID and email required' });
    }

    console.log('Auth callback: Checking for existing profile for user:', user.id);

    // Check if profile exists, create if not
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.log('Auth callback: Error checking profile:', checkError);
      throw checkError;
    }

    if (!existingProfile) {
      console.log('Auth callback: Creating new profile for user:', user.id, user.email);
      try {
        await authService.createProfile(user.id, user.email, user.user_metadata);
        console.log('Auth callback: Profile created successfully');
      } catch (createError) {
        console.log('Auth callback: Failed to create profile:', createError);
        throw createError;
      }
    } else {
      console.log('Auth callback: Profile already exists for user:', user.id);
    }

    res.json({
      message: 'Auth callback processed successfully',
      user: {
        id: user.id,
        email: user.email
      },
      session
    });
  } catch (error) {
    console.error('Auth callback error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Auth callback failed', details: error.message });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    await authService.logout();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test endpoint to create profile for current user (for debugging)
router.post('/create-profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token required' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return res.json({ message: 'Profile already exists', profile: existingProfile });
    }

    // Create profile
    const profile = await authService.createProfile(user.id, user.email, user.user_metadata);

    res.json({ message: 'Profile created successfully', profile });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'avatar'];
    const updates = {};

    // Only allow updating specific fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await authService.updateProfile(req.user.id, updates);

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { newPassword } = req.body;

    const result = await authService.changePassword(req.user.id, newPassword);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



module.exports = router;