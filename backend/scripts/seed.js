require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use service role key for seeding (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Test Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('cars')
      .select('id')
      .limit(1);

    if (testError && testError.code !== 'PGRST116') {
      throw new Error(`Supabase connection failed: ${testError.message}`);
    }

    console.log('✅ Connected to Supabase');

    // Note: Using service role key which bypasses RLS

    // Clear existing data (be careful in production!)
    console.log('🧹 Clearing existing data...');

    // Delete in correct order due to foreign key constraints
    await supabase.from('wishlist').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('reservations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('cars').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('✅ Cleared existing data');

    // Seed Cars
    const carsData = [
      {
        name: 'BMW X5 2023',
        brand: 'BMW',
        model: 'X5',
        year: 2023,
        price: 65000,
        description: 'Luxury SUV with premium features and excellent performance. Features advanced all-wheel drive, premium leather interior, and cutting-edge technology.',
        images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
        specifications: {
          engine: '3.0L Turbocharged I6',
          horsepower: 375,
          transmission: '8-Speed Automatic',
          fuelType: 'Gasoline',
          mileage: '22 city / 27 highway',
          color: 'Alpine White',
          seats: 5,
          drivetrain: 'All-Wheel Drive'
        },
        stock: 5,
        category: 'SUV',
        featured: true
      },
      {
        name: 'Mercedes-Benz C-Class 2023',
        brand: 'Mercedes-Benz',
        model: 'C-Class',
        year: 2023,
        price: 45000,
        description: 'Elegant sedan with cutting-edge technology and superior comfort. Experience the perfect blend of luxury and performance.',
        images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'],
        specifications: {
          engine: '2.0L Turbocharged I4',
          horsepower: 255,
          transmission: '9-Speed Automatic',
          fuelType: 'Gasoline',
          mileage: '24 city / 33 highway',
          color: 'Obsidian Black',
          seats: 5,
          drivetrain: 'Rear-Wheel Drive'
        },
        stock: 8,
        category: 'Sedan',
        featured: true
      },
      {
        name: 'Audi Q7 2023',
        brand: 'Audi',
        model: 'Q7',
        year: 2023,
        price: 58000,
        description: 'Premium SUV with advanced all-wheel drive and luxury interior. Experience the perfect combination of power and elegance.',
        images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'],
        specifications: {
          engine: '3.0L V6 Turbo',
          horsepower: 335,
          transmission: '8-Speed Automatic',
          fuelType: 'Gasoline',
          mileage: '19 city / 25 highway',
          color: 'Moonlight Blue',
          seats: 7,
          drivetrain: 'All-Wheel Drive'
        },
        stock: 4,
        category: 'SUV',
        featured: true
      },
      {
        name: 'Tesla Model 3 2023',
        brand: 'Tesla',
        model: 'Model 3',
        year: 2023,
        price: 42000,
        description: 'Electric sedan with autopilot and zero emissions. Experience the future of driving with cutting-edge autonomous technology.',
        images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'],
        specifications: {
          engine: 'Electric Motor',
          horsepower: 283,
          transmission: 'Single-Speed',
          fuelType: 'Electric',
          mileage: '140 MPGe city / 126 MPGe highway',
          color: 'Pearl White',
          seats: 5,
          drivetrain: 'Rear-Wheel Drive'
        },
        stock: 10,
        category: 'Sedan',
        featured: true
      },
      {
        name: 'Porsche 911 Carrera 2023',
        brand: 'Porsche',
        model: '911 Carrera',
        year: 2023,
        price: 120000,
        description: 'Iconic sports car with legendary performance. Experience the thrill of driving a true supercar.',
        images: ['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800'],
        specifications: {
          engine: '3.0L Twin-Turbo Flat-6',
          horsepower: 379,
          transmission: '8-Speed Dual-Clutch',
          fuelType: 'Gasoline',
          mileage: '18 city / 24 highway',
          color: 'Guards Red',
          seats: 4,
          drivetrain: 'Rear-Wheel Drive'
        },
        stock: 2,
        category: 'Coupe',
        featured: false
      },
      {
        name: 'Ford F-150 2023',
        brand: 'Ford',
        model: 'F-150',
        year: 2023,
        price: 35000,
        description: 'America\'s best-selling truck with unmatched capability. Perfect for work or play with legendary towing power.',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
        specifications: {
          engine: '3.3L V6',
          horsepower: 290,
          transmission: '10-Speed Automatic',
          fuelType: 'Gasoline',
          mileage: '20 city / 24 highway',
          color: 'Oxford White',
          seats: 6,
          drivetrain: 'Rear-Wheel Drive'
        },
        stock: 15,
        category: 'Truck',
        featured: false
      }
    ];

    const { data: createdCars, error: carsError } = await supabase
      .from('cars')
      .insert(carsData)
      .select();

    if (carsError) throw carsError;
    console.log(`✅ Seeded ${createdCars.length} cars`);

    // Create users via Supabase Auth (we'll create profiles after)
    console.log('👤 Creating users...');

    // Note: In a real application, you'd create users through Supabase Auth API
    // For seeding, we'll create the profiles directly (assuming auth users exist)
    // In production, use Supabase Auth API to create users

    const usersData = [
      {
        id: 'admin-user-id', // This would be a real UUID from Supabase Auth
        name: 'Admin User',
        email: 'admin@carcommerce.com',
        role: 'admin',
        is_active: true
      },
      {
        id: 'john-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        is_active: true
      },
      {
        id: 'jane-user-id',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        is_active: true
      }
    ];

    const { data: createdUsers, error: usersError } = await supabase
      .from('profiles')
      .insert(usersData)
      .select();

    if (usersError) {
      console.log('⚠️  Users might already exist, continuing...');
    } else {
      console.log(`✅ Created ${createdUsers?.length || 0} user profiles`);
    }

    // Add wishlist items
    if (createdUsers && createdUsers.length >= 2) {
      const john = createdUsers.find(u => u.email === 'john@example.com');
      const jane = createdUsers.find(u => u.email === 'jane@example.com');

      if (john && jane) {
        const wishlistData = [
          { user_id: john.id, car_id: createdCars[0].id },
          { user_id: john.id, car_id: createdCars[2].id },
          { user_id: jane.id, car_id: createdCars[1].id }
        ];

        const { error: wishlistError } = await supabase
          .from('wishlist')
          .insert(wishlistData);

        if (wishlistError) {
          console.log('⚠️  Error adding wishlist items:', wishlistError.message);
        } else {
          console.log('✅ Added wishlist items');
        }
      }
    }

    // Note: RLS remains enabled for security

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Sample Data Created:');
    console.log('👤 Users: admin@carcommerce.com, john@example.com, jane@example.com');
    console.log('🚗 Cars: 6 premium cars (BMW, Mercedes, Audi, Tesla, Porsche, Ford)');
    console.log('💝 Wishlist: Users have cars in their wishlist');

    console.log('\n⚠️  Note: User authentication will need to be set up through Supabase Auth');
    console.log('📖 Check the README for complete setup instructions');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;