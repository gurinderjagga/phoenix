const supabase = require('../config/supabase');

class CarService {
  // Get all cars with filtering and pagination
  async getCars({
    page = 1,
    limit = 12,
    category,
    brand,
    minPrice,
    maxPrice,
    featured,
    search,
    sort = 'created_at'
  }) {
    try {
      console.log('CarService.getCars called with:', { page, limit, category, brand, minPrice, maxPrice, featured, search, sort });

      let query = supabase.from('cars').select('*');

      // Apply filters
      if (category) {
        query = query.eq('category', category);
      }

      if (brand) {
        query = query.ilike('brand', `%${brand}%`);
      }

      if (minPrice !== undefined) {
        query = query.gte('price', minPrice);
      }

      if (maxPrice !== undefined) {
        query = query.lte('price', maxPrice);
      }

      if (featured !== undefined) {
        query = query.eq('featured', featured === 'true');
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Apply sorting - map frontend sort names to database column names
      let sortField = 'created_at';
      let ascending = false; // default to newest first

      if (sort === 'createdAt') {
        sortField = 'created_at';
        ascending = true;
      } else if (sort === '-createdAt' || sort === 'created_at') {
        sortField = 'created_at';
        ascending = false;
      } else if (sort === 'price') {
        sortField = 'price';
        ascending = true;
      } else if (sort === '-price') {
        sortField = 'price';
        ascending = false;
      } else if (sort === 'rating') {
        sortField = 'rating';
        ascending = false;
      }

      query = query.order(sortField, { ascending });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      console.log('Executing Supabase query...');
      const { data, error } = await query;
      console.log('Query result:', { data: data?.length || 0, error });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      // Get total count separately (simpler approach)
      const { count, error: countError } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Count query error:', countError);
      }

      const totalCount = count || data.length;

      return {
        cars: data || [],
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCars: totalCount,
        hasNextPage: (page * limit) < totalCount,
        hasPrevPage: page > 1
      };
    } catch (error) {
      console.error('CarService.getCars error:', error);
      throw new Error('Failed to fetch cars');
    }
  }

  // Get single car by ID
  async getCarById(id) {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          reviews (
            id,
            rating,
            comment,
            created_at,
            profiles (
              name
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw new Error('Car not found');
    }
  }

  // Create new car (admin only)
  async createCar(carData) {
    try {
      const { data, error } = await supabase
        .from('cars')
        .insert([carData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw new Error('Failed to create car');
    }
  }

  // Update car (admin only)
  async updateCar(id, updates) {
    try {
      const { data, error } = await supabase
        .from('cars')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw new Error('Failed to update car');
    }
  }

  // Delete car (admin only)
  async deleteCar(id) {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { message: 'Car deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete car');
    }
  }

  // Add review to car
  async addReview(carId, userId, { rating, comment }) {
    try {
      // Check if user already reviewed this car
      const { data: existingReview, error: checkError } = await supabase
        .from('reviews')
        .select('*')
        .eq('car_id', carId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingReview) {
        throw new Error('You have already reviewed this car');
      }

      // Add review
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          car_id: carId,
          user_id: userId,
          rating,
          comment
        }])
        .select()
        .single();

      if (error) throw error;

      // Get updated car with reviews
      const updatedCar = await this.getCarById(carId);

      return updatedCar;
    } catch (error) {
      throw new Error(error.message || 'Failed to add review');
    }
  }

  // Get featured cars
  async getFeaturedCars() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;

      return data;
    } catch (error) {
      throw new Error('Failed to fetch featured cars');
    }
  }

  // Search cars
  async searchCars(query, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return data;
    } catch (error) {
      throw new Error('Search failed');
    }
  }
}

module.exports = new CarService();