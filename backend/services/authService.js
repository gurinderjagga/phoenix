const supabase = require('../config/supabase');

class AuthService {
  // Create profile for newly registered user (called by Supabase Auth webhook)
  async createProfile(userId, email, userMetadata = {}) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          name: userMetadata.name || email.split('@')[0],
          email,
          phone: userMetadata.phone || null,
          role: 'user'
        }])
        .select('id, name, email, phone, avatar, role, is_active, created_at, updated_at')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Failed to create user profile');
    }
  }

  // Get user by Supabase Auth ID
  async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, phone, avatar, role, is_active, created_at, updated_at')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('User not found');
    }
  }

  // Register user (redirect to Supabase Auth - this is for API compatibility)
  async register({ email, password, name, phone }) {
    try {
      // This would typically redirect to Supabase Auth
      // For API compatibility, we'll simulate the response
      return {
        message: 'Registration initiated. Check your email to confirm.',
        redirect: true // Frontend should handle Supabase Auth signup
      };
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  // Login user (redirect to Supabase Auth - this is for API compatibility)
  async login({ email, password }) {
    try {
      // This would typically redirect to Supabase Auth
      // For API compatibility, we'll simulate the response
      return {
        message: 'Login initiated.',
        redirect: true // Frontend should handle Supabase Auth signin
      };
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  // Get current user profile
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, phone, avatar, role, is_active, created_at, updated_at')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw new Error('Failed to get user profile');
    }
  }

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select('id, name, email, phone, avatar, role, is_active, created_at, updated_at')
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }

  // Change password
  async changePassword(userId, newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new Error('Failed to change password');
    }
  }



  // Logout
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new Error('Logout failed');
    }
  }
}

module.exports = new AuthService();