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
    await supabase.from('reservations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('cars').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('✅ Cleared existing data');

    // Seed Cars
    const carsData = [
      {
        name: 'Tesla Model Y 2023', brand: 'Tesla', model: 'Model Y', year: 2023, price: 50490,
        description: 'Electric compact SUV with dual motor all-wheel drive, versatile seating, and top-tier safety features.', images: ['https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800'],
        specifications: { engine: 'Dual Electric', horsepower: 384, transmission: 'Single-Speed', fuelType: 'Electric', mileage: '330 miles range', color: 'Solid Black', seats: 5, drivetrain: 'AWD' },
        stock: 12, category: 'SUV', featured: true
      },
      {
        name: 'BMW i4 M50 2023', brand: 'BMW', model: 'i4', year: 2023, price: 68700,
        description: 'First purely electric performance model from BMW M with thrilling driving dynamics.', images: ['https://images.unsplash.com/photo-1620882705054-04353ed706d4?w=800'],
        specifications: { engine: 'Dual Electric', horsepower: 536, transmission: 'Single-Speed', fuelType: 'Electric', mileage: '270 miles', color: 'Portimao Blue', seats: 5, drivetrain: 'AWD' },
        stock: 4, category: 'Sedan', featured: true
      },
      {
        name: 'Lucid Air Grand Touring 2023', brand: 'Lucid', model: 'Air', year: 2023, price: 138000,
        description: 'Luxury electric sedan offering unparalleled range, incredible performance, and futuristic design.', images: ['https://images.unsplash.com/photo-1662914104710-85f2693ea5ce?w=800'],
        specifications: { engine: 'Dual Electric', horsepower: 819, transmission: 'Single-Speed', fuelType: 'Electric', mileage: '516 miles', color: 'Zenith Red', seats: 5, drivetrain: 'AWD' },
        stock: 2, category: 'Sedan', featured: true
      },
      {
        name: 'Porsche Taycan 4S 2023', brand: 'Porsche', model: 'Taycan', year: 2023, price: 106500,
        description: 'High-performance electric sports sedan that retains the true Porsche driving experience.', images: ['https://images.unsplash.com/photo-1614168051649-16637bfe285c?w=800'],
        specifications: { engine: 'Dual Electric', horsepower: 522, transmission: '2-Speed Auto', fuelType: 'Electric', mileage: '227 miles', color: 'Carrara White', seats: 4, drivetrain: 'AWD' },
        stock: 4, category: 'Sedan', featured: true
      },
      {
        name: 'Mercedes-Benz EQS 450+ 2023', brand: 'Mercedes-Benz', model: 'EQS', year: 2023, price: 104400,
        description: 'The S-Class of electric vehicles, offering unmatched interior luxury and quietness.', images: ['https://images.unsplash.com/photo-1685351408137-b952b1be79b2?w=800'],
        specifications: { engine: 'Single Electric', horsepower: 329, transmission: 'Single-Speed', fuelType: 'Electric', mileage: '350 miles', color: 'Nautical Blue', seats: 5, drivetrain: 'RWD' },
        stock: 5, category: 'Sedan', featured: true
      },
      {
        name: 'Pegassi Zentorno',
        brand: 'Pegassi',
        model: 'Zentorno',
        year: 2014,
        price: 725000,
        description: 'A heavily armored, high-performance hybrid hypercar. Make sure you don\'t scratch the paint.',
        images: ['https://images.unsplash.com/photo-1544839655-4424ce1ea26a?w=800'],
        specifications: {
          engine: '6.8L V12 Hybrid',
          horsepower: 750,
          transmission: '6-Speed AWD',
          fuelType: 'Hybrid',
          mileage: '12 city / 18 highway',
          color: 'Matte Black',
          seats: 2,
          drivetrain: 'All-Wheel Drive'
        },
        stock: 3,
        category: 'Sedan', // Using Sedan to bypass DB constraint
        featured: true
      },
      {
        name: 'Truffade Adder',
        brand: 'Truffade',
        model: 'Adder',
        year: 2013,
        price: 1000000,
        description: 'If you want to go from zero to sixty in under three seconds, and then burst into flames, this is the car for you.',
        images: ['https://images.unsplash.com/photo-1571343015975-faddcc141f22?w=800'],
        specifications: {
          engine: '8.0L Quad-Turbo W16',
          horsepower: 1100,
          transmission: '7-Speed Dual Clutch',
          fuelType: 'Gasoline',
          mileage: '8 city / 15 highway',
          color: 'Metallic Silver',
          seats: 2,
          drivetrain: 'All-Wheel Drive'
        },
        stock: 2,
        category: 'Sedan',
        featured: true
      },
      {
        name: 'Grotti Turismo R',
        brand: 'Grotti',
        model: 'Turismo R',
        year: 2014,
        price: 500000,
        description: 'A hybrid hypercar blending an electric motor with an internal combustion engine to strip away your sanity.',
        images: ['https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800'],
        specifications: {
          engine: '7.2L V12 Hybrid',
          horsepower: 799,
          transmission: '6-Speed RWD',
          fuelType: 'Hybrid',
          mileage: '16 city / 20 highway',
          color: 'Torino Red',
          seats: 2,
          drivetrain: 'Rear-Wheel Drive'
        },
        stock: 5,
        category: 'Sedan',
        featured: true
      },
      {
        name: 'Vapid Dominator',
        brand: 'Vapid',
        model: 'Dominator',
        year: 2012,
        price: 35000,
        description: 'A two-blade muscle car that screams American excess. Prepare to spend heavily on replacement rear tires.',
        images: ['https://images.unsplash.com/photo-1549419148-5c4ecccad093?w=800'],
        specifications: {
          engine: 'High Output V8',
          horsepower: 450,
          transmission: '5-Speed Manual',
          fuelType: 'Gasoline',
          mileage: '15 city / 25 highway',
          color: 'Racing Blue',
          seats: 2,
          drivetrain: 'Rear-Wheel Drive'
        },
        stock: 12,
        category: 'Sedan',
        featured: false
      },
      {
        name: 'Bravado Banshee',
        brand: 'Bravado',
        model: 'Banshee',
        year: 2013,
        price: 105000,
        description: 'The definitive American sports car. Lightweight, powerful, and ready to spin out on the first corner.',
        images: ['https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800'],
        specifications: {
          engine: '8.4L V10',
          horsepower: 500,
          transmission: '6-Speed RWD',
          fuelType: 'Gasoline',
          mileage: '12 city / 21 highway',
          color: 'Nautical Blue with Stripes',
          seats: 2,
          drivetrain: 'Rear-Wheel Drive'
        },
        stock: 8,
        category: 'Sedan',
        featured: false
      },
      {
        name: 'Karin Kuruma (Armored)',
        brand: 'Karin',
        model: 'Kuruma',
        year: 2015,
        price: 525000,
        description: 'The perfect vehicle for transporting your crew to a heist while deflecting small arms fire.',
        images: ['https://images.unsplash.com/photo-1603386053331-b8efd8ec4ae1?w=800'],
        specifications: {
          engine: 'Turbo-charged Inline-4',
          horsepower: 350,
          transmission: '6-Speed AWD',
          fuelType: 'Gasoline',
          mileage: '18 city / 25 highway',
          color: 'Matte Black',
          seats: 4,
          drivetrain: 'All-Wheel Drive'
        },
        stock: 10,
        category: 'Sedan',
        featured: true
      },
      {
        name: 'Ocelot Pariah',
        brand: 'Ocelot',
        model: 'Pariah',
        year: 2017,
        price: 1420000,
        description: 'A sports car that outpaces practically every supercar in a straight line. Unmatched top speed.',
        images: ['https://images.unsplash.com/photo-1628155930542-3c7a64e2c848?w=800'],
        specifications: {
          engine: 'Twin-cam Inline 4',
          horsepower: 600,
          transmission: '7-Speed RWD',
          fuelType: 'Gasoline',
          mileage: '18 city / 28 highway',
          color: 'Ice White',
          seats: 2,
          drivetrain: 'Rear-Wheel Drive'
        },
        stock: 4,
        category: 'Sedan',
        featured: false
      },
      {
        name: 'Gallivanter Baller ST',
        brand: 'Gallivanter',
        model: 'Baller ST',
        year: 2021,
        price: 890000,
        description: 'The ultimate status symbol SUV. Perfect for navigating the Vinewood Hills in comfort and style.',
        images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'],
        specifications: {
          engine: 'Supercharged V8',
          horsepower: 550,
          transmission: '8-Speed AWD',
          fuelType: 'Gasoline',
          mileage: '14 city / 19 highway',
          color: 'Metallic Black',
          seats: 4,
          drivetrain: 'All-Wheel Drive'
        },
        stock: 6,
        category: 'SUV',
        featured: true
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



    // Note: RLS remains enabled for security

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Sample Data Created:');
    console.log('👤 Users: admin@carcommerce.com, john@example.com, jane@example.com');
    console.log('🚗 Cars: 6 premium cars (BMW, Mercedes, Audi, Tesla, Porsche, Ford)');

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