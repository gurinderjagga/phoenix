import { supabase } from './supabase';

const API_BASE_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000/api`;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic fetch with error handling
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      // Add auth token if available
      const token = await this.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Auth token added to request');
      } else {
        console.log('⚠️ No auth token available');
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get auth token from Supabase session
  async getAuthToken() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('❌ Error getting session:', error);
        return null;
      }
      if (!session) {
        console.log('⚠️ No active session found');
        return null;
      }
      return session.access_token;
    } catch (error) {
      console.error('❌ Error retrieving auth token:', error);
      return null;
    }
  }

  // Cars API
  async getCars(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.set(key, value);
      }
    });

    const query = queryParams.toString();
    return this.request(`/cars${query ? `?${query}` : ''}`);
  }

  async getCarById(id) {
    return this.request(`/cars/${id}`);
  }

  async getFeaturedCars() {
    return this.request('/cars/featured/all');
  }

  async addCarReview(carId, reviewData) {
    return this.request(`/cars/${carId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Auth API
  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async toggleWishlist(carId) {
    return this.request(`/auth/wishlist/${carId}`, {
      method: 'POST',
    });
  }

  async getWishlist() {
    return this.request('/auth/wishlist');
  }

  // Cart API
  async getCart() {
    return this.request('/cart');
  }

  async getCartSummary() {
    return this.request('/cart/summary');
  }

  async addToCart(carId, quantity = 1) {
    return this.request(`/cart/add/${carId}`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  }

  async updateCartItem(cartItemId, quantity) {
    return this.request(`/cart/item/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(cartItemId) {
    return this.request(`/cart/item/${cartItemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  // Profile management
  async createProfile() {
    return this.request('/auth/create-profile', {
      method: 'POST',
    });
  }

  // Orders API
  async getMyOrders() {
    return this.request('/orders/my-orders');
  }

  async getOrderById(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async bookCar(carId, quantity = 1, shippingAddress = null, paymentMethod = 'bank_transfer', orderNotes = null) {
    return this.request('/orders/book', {
      method: 'POST',
      body: JSON.stringify({
        carId,
        quantity,
        shippingAddress,
        paymentMethod,
        orderNotes
      })
    });
  }

  async cancelOrder(orderId) {
    return this.request(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    });
  }

  // Auth info for frontend
  async getAuthInfo() {
    return this.request('/auth/info');
  }
  // Admin API
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAllUsers(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.set(key, value);
      }
    });
    const query = queryParams.toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`);
  }

  async getUserById(id) {
    return this.request(`/admin/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async getAllBookings() {
    return this.request('/admin/bookings');
  }

  async updateBookingStatus(orderId, status) {
    return this.request(`/admin/bookings/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Admin Car Management (if not covered by general car API)
  async deleteCar(carId) {
    // Assuming backend also supports DELETE /admin/cars/:id or similar
    // For now we used standard car delete in components, but let's route it through specific admin endpoint if needed
    // or just use generic cars endpoint if authorized.
    // Let's assume standard cars endpoint is protected for DELETE.
    return this.request(`/cars/${carId}`, {
      method: 'DELETE'
    });
  }

  async createCar(carData) {
    return this.request('/cars', {
      method: 'POST',
      body: JSON.stringify(carData)
    });
  }

  async updateCar(carId, carData) {
    return this.request(`/cars/${carId}`, {
      method: 'PUT',
      body: JSON.stringify(carData)
    });
  }
}

export const apiService = new ApiService();
export default apiService;