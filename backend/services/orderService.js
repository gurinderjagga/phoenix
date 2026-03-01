const supabase = require('../config/supabase');

class OrderService {
  // Get user's orders
  async getUserOrders(userId, page = 1, limit = 10) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            cars (
              id,
              name,
              brand,
              model,
              images
            )
          )
        `, { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        orders: data,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalOrders: count,
        hasNextPage: (page * limit) < count,
        hasPrevPage: page > 1
      };
    } catch (error) {
      throw new Error('Failed to fetch orders');
    }
  }

  // Get single order by ID
  async getOrderById(orderId, userId, isAdmin = false) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            cars (
              id,
              name,
              brand,
              model,
              images,
              specifications
            )
          ),
          profiles (
            name,
            email
          )
        `)
        .eq('id', orderId);

      // If not admin, only allow viewing own orders
      if (!isAdmin) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw new Error('Order not found');
    }
  }

  // Book a car directly (single car booking)
  async bookCar(userId, bookingData) {
    try {
      const { carId, quantity = 1, shippingAddress, paymentMethod, orderNotes } = bookingData;

      // Get car details and validate stock
      const { data: car, error: carError } = await supabase
        .from('cars')
        .select('id, name, price, stock')
        .eq('id', carId)
        .single();

      if (carError || !car) {
        throw new Error(`Car with ID ${carId} not found`);
      }

      if (car.stock < quantity) {
        throw new Error(`Insufficient stock for ${car.name}`);
      }

      const totalAmount = car.price * quantity;

      // Create order with required fields - provide defaults if not specified
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: userId,
          total_amount: totalAmount,
          shipping_address: shippingAddress || { address: 'To be provided', city: 'TBD', country: 'TBD' },
          payment_method: paymentMethod || 'bank_transfer',
          order_notes: orderNotes || `Booking for ${car.name}`,
          status: 'pending' // Default booking status is pending
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order item
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert([{
          order_id: order.id,
          car_id: car.id,
          quantity: quantity,
          price: car.price
        }]);

      if (itemsError) throw itemsError;

      // Update car stock
      const { error: stockError } = await supabase
        .from('cars')
        .update({ stock: car.stock - quantity })
        .eq('id', car.id);

      if (stockError) throw stockError;

      // Get complete order with items
      const completeOrder = await this.getOrderById(order.id, userId);

      return {
        message: 'Car booked successfully',
        order: completeOrder
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to book car');
    }
  }

  // Create new order
  async createOrder(userId, orderData) {
    try {
      const { items, shippingAddress, paymentMethod, orderNotes } = orderData;

      // Calculate total amount and validate stock
      let totalAmount = 0;
      const validatedItems = [];

      for (const item of items) {
        const { data: car, error: carError } = await supabase
          .from('cars')
          .select('id, name, price, stock')
          .eq('id', item.car)
          .single();

        if (carError || !car) {
          throw new Error(`Car with ID ${item.car} not found`);
        }

        if (car.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${car.name}`);
        }

        validatedItems.push({
          car_id: car.id,
          quantity: item.quantity,
          price: car.price,
          current_stock: car.stock
        });

        totalAmount += car.price * item.quantity;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: userId,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          order_notes: orderNotes,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = validatedItems.map(item => ({
        order_id: order.id,
        car_id: item.car_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update car stock
      for (const item of validatedItems) {
        const { error: stockError } = await supabase
          .from('cars')
          .update({ stock: item.current_stock - item.quantity })
          .eq('id', item.car_id);

        if (stockError) throw stockError;
      }

      // Get complete order with items
      const completeOrder = await this.getOrderById(order.id, userId);

      return {
        message: 'Order created successfully',
        order: completeOrder
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to create order');
    }
  }

  // Update order status (admin only)
  async updateOrderStatus(orderId, status) {
    try {
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select(`
          *,
          order_items (
            quantity,
            price,
            cars (
              id,
              name,
              brand,
              model
            )
          ),
          profiles (
            name,
            email
          )
        `)
        .single();

      if (error) throw error;

      return {
        message: 'Order status updated successfully',
        order: data
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to update order status');
    }
  }

  // Cancel order
  async cancelOrder(orderId, userId, isAdmin = false) {
    try {
      // Get order details
      const order = await this.getOrderById(orderId, userId, isAdmin);

      if (!order) {
        throw new Error('Order not found');
      }

      // Check permissions
      if (!isAdmin && order.status !== 'pending') {
        throw new Error('Can only cancel pending orders');
      }

      // Update order status
      const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Restore stock if cancelling
      if (order.status !== 'cancelled') {
        for (const item of order.order_items) {
          // Get current stock
          const { data: car, error: carError } = await supabase
            .from('cars')
            .select('stock')
            .eq('id', item.cars.id)
            .single();

          if (carError || !car) {
            throw new Error(`Car with ID ${item.cars.id} not found`);
          }

          const { error: stockError } = await supabase
            .from('cars')
            .update({ stock: car.stock + item.quantity })
            .eq('id', item.cars.id);

          if (stockError) throw stockError;
        }
      }

      const completeOrder = await this.getOrderById(orderId, userId, isAdmin);

      return {
        message: 'Order cancelled successfully',
        order: completeOrder
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to cancel order');
    }
  }

  // Get all orders (admin only)
  async getAllOrders(page = 1, limit = 10, status) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            cars (
              id,
              name,
              brand,
              model,
              price
            )
          ),
          profiles (
            name,
            email
          )
        `, { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        orders: data,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalOrders: count,
        hasNextPage: (page * limit) < count,
        hasPrevPage: page > 1
      };
    } catch (error) {
      console.error('OrderService.getAllOrders error:', error);
      throw error;
    }
  }
}

module.exports = new OrderService();