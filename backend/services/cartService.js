const supabase = require('../config/supabase');

class CartService {
  // Get user's cart items
  async getUserCart(userId) {
    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          id,
          quantity,
          created_at,
          updated_at,
          cars (
            id,
            name,
            brand,
            model,
            year,
            price,
            images,
            stock
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        carId: item.cars.id,
        quantity: item.quantity,
        car: item.cars,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    } catch (error) {
      console.error('CartService.getUserCart error:', error);
      throw new Error('Failed to fetch cart items');
    }
  }

  // Add item to cart
  async addToCart(userId, carId, quantity = 1) {
    try {
      // Check if car exists and has stock
      const { data: car, error: carError } = await supabase
        .from('cars')
        .select('id, stock')
        .eq('id', carId)
        .single();

      if (carError || !car) {
        throw new Error('Car not found');
      }

      if (car.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      // Check if item already in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId)
        .eq('car_id', carId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;

        if (car.stock < newQuantity) {
          throw new Error('Insufficient stock for requested quantity');
        }

        const { data, error } = await supabase
          .from('cart')
          .update({ quantity: newQuantity })
          .eq('user_id', userId)
          .eq('car_id', carId)
          .select()
          .single();

        if (error) throw error;
        return { message: 'Cart updated successfully', item: data };
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('cart')
          .insert([{
            user_id: userId,
            car_id: carId,
            quantity: quantity
          }])
          .select()
          .single();

        if (error) throw error;
        return { message: 'Item added to cart successfully', item: data };
      }
    } catch (error) {
      console.error('CartService.addToCart error:', error);
      throw new Error(error.message || 'Failed to add item to cart');
    }
  }

  // Update cart item quantity
  async updateCartItem(userId, cartItemId, quantity) {
    try {
      if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }

      // Get cart item with car details to check stock
      const { data: cartItem, error: cartError } = await supabase
        .from('cart')
        .select(`
          *,
          cars (stock)
        `)
        .eq('id', cartItemId)
        .eq('user_id', userId)
        .single();

      if (cartError || !cartItem) {
        throw new Error('Cart item not found');
      }

      if (cartItem.cars.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      const { data, error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { message: 'Cart item updated successfully', item: data };
    } catch (error) {
      console.error('CartService.updateCartItem error:', error);
      throw new Error(error.message || 'Failed to update cart item');
    }
  }

  // Remove item from cart
  async removeFromCart(userId, cartItemId) {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', userId);

      if (error) throw error;
      return { message: 'Item removed from cart successfully' };
    } catch (error) {
      console.error('CartService.removeFromCart error:', error);
      throw new Error('Failed to remove item from cart');
    }
  }

  // Clear user's cart
  async clearCart(userId) {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { message: 'Cart cleared successfully' };
    } catch (error) {
      console.error('CartService.clearCart error:', error);
      throw new Error('Failed to clear cart');
    }
  }

  // Get cart summary (total items, total price)
  async getCartSummary(userId) {
    try {
      const cartItems = await this.getUserCart(userId);

      const summary = cartItems.reduce((acc, item) => {
        acc.totalItems += item.quantity;
        acc.totalPrice += item.car.price * item.quantity;
        return acc;
      }, { totalItems: 0, totalPrice: 0 });

      return summary;
    } catch (error) {
      console.error('CartService.getCartSummary error:', error);
      throw new Error('Failed to get cart summary');
    }
  }
}

module.exports = new CartService();