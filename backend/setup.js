const fs = require('fs');
const path = require('path');

console.log('🚗 Car Commerce Database Setup');
console.log('================================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');

  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# For MongoDB Atlas (recommended - free cloud database):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/car-commerce?retryWrites=true&w=majority

# For local MongoDB (requires MongoDB installed locally):
# MONGODB_URI=mongodb://localhost:27017/car-commerce

# JWT Configuration
JWT_SECRET=car_commerce_jwt_secret_key_2024_change_this_in_production

# 📖 SETUP INSTRUCTIONS:
# 1. Go to https://cloud.mongodb.com/
# 2. Create a free account and cluster
# 3. Create a database called "car-commerce"
# 4. Go to Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0)
# 5. Go to Database Access -> Create a database user
# 6. Go to Connect -> Connect your application
# 7. Copy the connection string and replace the MONGODB_URI above
# 8. Replace <username>, <password>, and <cluster> with your actual values
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
  } catch (error) {
    console.log('❌ Error creating .env file:', error.message);
    console.log('📝 Please create .env file manually with the content shown above');
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Set up MongoDB Atlas (free): https://cloud.mongodb.com/');
console.log('2. Update MONGODB_URI in .env file with your connection string');
console.log('3. Run: npm run seed (to populate database with sample data)');
console.log('4. Run: npm start (to start the server)');

console.log('\n💡 Alternative - Local MongoDB:');
console.log('1. Install MongoDB Community Server');
console.log('2. Start MongoDB: mongod');
console.log('3. Change MONGODB_URI to: mongodb://localhost:27017/car-commerce');

console.log('\n🎯 Sample Data Includes:');
console.log('• 6 Premium cars (BMW, Mercedes, Audi, Tesla, Porsche, Ford)');
console.log('• Admin user: admin@carcommerce.com / admin123');
console.log('• Regular users with wishlists');
console.log('• Car reviews and ratings');

console.log('\n🚀 Ready to start your car commerce platform!');