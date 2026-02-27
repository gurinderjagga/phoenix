const supabase = require('../config/supabase');

// Verify Supabase Auth session middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify the session with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ message: 'User profile not found. Please complete registration.' });
    }

    if (!profile.is_active) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.user = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatar: profile.avatar
    };
    req.token = token;
    req.supabaseUser = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ message: 'Authentication failed' });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Optional authentication (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (!error && user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile && profile.is_active) {
          req.user = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            avatar: profile.avatar
          };
          req.token = token;
        }
      }
    }
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};