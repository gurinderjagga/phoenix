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
          address: userMetadata.address || null,
          role: 'user'
        }])
        .select()
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
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('User not found');
    }
  }

  // Register user (redirect to Supabase Auth - this is for API compatibility)
  async register({ email, password, name, phone, address }) {
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
        .select('*')
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
        .select()
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

  // Add car to wishlist
  async toggleWishlist(userId, carId) {
    try {
      // Check if item exists in wishlist
      const { data: existing, error: checkError } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', userId)
        .eq('car_id', carId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        // Remove from wishlist
        const { error: deleteError } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', userId)
          .eq('car_id', carId);

        if (deleteError) throw deleteError;

        return { message: 'Removed from wishlist', inWishlist: false };
      } else {
        // Add to wishlist
        const { error: insertError } = await supabase
          .from('wishlist')
          .insert([{
            user_id: userId,
            car_id: carId
          }]);

        if (insertError) throw insertError;

        return { message: 'Added to wishlist', inWishlist: true };
      }
    } catch (error) {
      throw new Error('Failed to update wishlist');
    }
  }

  // Get user wishlist
  async getWishlist(userId) {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id,
          created_at,
          cars (
            id,
            name,
            brand,
            model,
            year,
            price,
            images,
            specifications,
            stock,
            category,
            rating
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      return data.map(item => item.cars);
    } catch (error) {
      throw new Error('Failed to get wishlist');
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