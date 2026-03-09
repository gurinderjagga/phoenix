const supabase = require('../config/supabase');

class ReservationService {
  // Get user's reservations
  async getUserReservations(userId, page = 1, limit = 10) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let data, error, count;

      // Try relational join (works after SQL migration adds car_id FK)
      ({ data, error, count } = await supabase
        .from('reservations')
        .select(`*, cars ( id, name, brand, model, images )`, { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to));

      // Fallback: plain select if join fails (migration not yet run)
      if (error) {
        ({ data, error, count } = await supabase
          .from('reservations')
          .select('*', { count: 'exact' })
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(from, to));
      }

      if (error) throw error;

      return {
        reservations: data,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalReservations: count,
        hasNextPage: (page * limit) < count,
        hasPrevPage: page > 1
      };
    } catch (error) {
      console.error('getUserReservations error:', error.message);
      throw new Error('Failed to fetch reservations');
    }
  }

  // Get single reservation by ID
  async getReservationById(reservationId, userId, isAdmin = false) {
    try {
      let query = supabase.from('reservations').eq('id', reservationId);
      if (!isAdmin) query = query.eq('user_id', userId);

      // Try with car join first
      let result = await supabase
        .from('reservations')
        .select(`*, cars ( id, name, brand, model, images, specifications ), profiles ( name, email )`)
        .eq('id', reservationId)
      [isAdmin ? 'maybeSingle' : 'single']();

      if (result.error) {
        // Fallback without car join
        result = await supabase
          .from('reservations')
          .select(`*, profiles ( name, email )`)
          .eq('id', reservationId)
          .single();
      }

      if (!isAdmin && result.data && result.data.user_id !== userId) {
        throw new Error('Not authorised');
      }

      if (result.error) throw result.error;
      return result.data;
    } catch (error) {
      throw new Error('Reservation not found');
    }
  }

  // Book a car directly (single car booking)
  async bookCar(userId, bookingData) {
    try {
      const { carId, quantity = 1, shippingAddress, paymentMethod, orderNotes: reservationNotes } = bookingData;

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

      // Create reservation
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .insert([{
          user_id: userId,
          car_id: car.id,
          quantity: quantity,
          price: car.price,
          total_amount: totalAmount,
          shipping_address: shippingAddress || { address: 'To be provided', city: 'TBD', country: 'TBD' },
          payment_method: paymentMethod || 'bank_transfer',
          payment_status: 'paid',
          order_notes: reservationNotes || `Reservation for ${car.name}`,
          status: 'pending'
        }])
        .select()
        .single();

      if (reservationError) throw reservationError;

      // Update car stock
      const { error: stockError } = await supabase
        .from('cars')
        .update({ stock: car.stock - quantity })
        .eq('id', car.id);

      if (stockError) throw stockError;

      return {
        message: 'Car reserved successfully',
        reservation
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to reserve car');
    }
  }

  // Update reservation status (admin only)
  async updateReservationStatus(reservationId, status) {
    try {
      const validStatuses = ['pending', 'confirmed', 'ready for pickup'];

      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }

      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', reservationId)
        .select(`
          *,
          cars (
            id,
            name,
            brand,
            model
          ),
          profiles (
            name,
            email
          )
        `)
        .single();

      if (error) throw error;

      return {
        message: 'Reservation status updated successfully',
        reservation: data
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to update reservation status');
    }
  }

  // Cancel reservation
  async cancelReservation(reservationId, userId, isAdmin = false) {
    try {
      // Get reservation details
      const reservation = await this.getReservationById(reservationId, userId, isAdmin);

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      // Check permissions
      if (!isAdmin && reservation.status !== 'pending') {
        throw new Error('Can only cancel pending reservations');
      }

      // Update reservation status
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);

      if (updateError) throw updateError;

      // Restore stock if cancelling
      if (reservation.status !== 'cancelled' && reservation.car_id) {
        const { data: car, error: carError } = await supabase
          .from('cars')
          .select('stock')
          .eq('id', reservation.car_id)
          .single();

        if (!carError && car) {
          await supabase
            .from('cars')
            .update({ stock: car.stock + (reservation.quantity || 1) })
            .eq('id', reservation.car_id);
        }
      }

      const completeReservation = await this.getReservationById(reservationId, userId, isAdmin);

      return {
        message: 'Reservation cancelled successfully',
        reservation: completeReservation
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to cancel reservation');
    }
  }

  // Get all reservations (admin only)
  async getAllReservations(page = 1, limit = 10, status) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let selectStr = `*, cars ( id, name, brand, model, price, images ), profiles ( name, email )`;

      let query = supabase.from('reservations').select(selectStr, { count: 'exact' });
      if (status) query = query.eq('status', status);

      let { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      // Fallback without car join
      if (error) {
        query = supabase.from('reservations').select(`*, profiles ( name, email )`, { count: 'exact' });
        if (status) query = query.eq('status', status);
        ({ data, error, count } = await query
          .order('created_at', { ascending: false })
          .range(from, to));
      }

      if (error) throw error;

      return {
        reservations: data,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalReservations: count,
        hasNextPage: (page * limit) < count,
        hasPrevPage: page > 1
      };
    } catch (error) {
      console.error('ReservationService.getAllReservations error:', error);
      throw error;
    }
  }
}

module.exports = new ReservationService();