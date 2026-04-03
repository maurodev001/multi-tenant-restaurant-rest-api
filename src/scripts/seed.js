require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../config');
const Tenant = require('../models/Tenant');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const tenants = [
  { name: 'Acme Food Corp', slug: 'acme-food', contactEmail: 'admin@acmefood.com' },
  { name: 'Global Eats Inc', slug: 'global-eats', contactEmail: 'admin@globaleats.com' },
];

const restaurantsPerTenant = [
  [
    {
      name: 'Acme Burger House',
      description: 'Classic American burgers and fries',
      address: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
      cuisineType: ['American', 'Fast Food'],
      rating: 4.2,
    },
    {
      name: 'Acme Sushi Bar',
      description: 'Fresh sushi and Japanese cuisine',
      address: { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zipCode: '90001', country: 'USA' },
      cuisineType: ['Japanese', 'Sushi'],
      rating: 4.7,
    },
  ],
  [
    {
      name: 'Global Pizza Palace',
      description: 'Authentic Italian pizza and pasta',
      address: { street: '789 Elm Rd', city: 'Chicago', state: 'IL', zipCode: '60601', country: 'USA' },
      cuisineType: ['Italian', 'Pizza'],
      rating: 4.5,
    },
  ],
];

const menuItemsByRestaurant = [
  [
    { name: 'Classic Burger', description: 'Beef patty with lettuce and tomato', price: 9.99, category: 'main' },
    { name: 'Cheese Fries', description: 'Crispy fries with melted cheddar', price: 5.49, category: 'side' },
    { name: 'Milkshake', description: 'Creamy vanilla milkshake', price: 4.99, category: 'beverage' },
    { name: 'Onion Rings', description: 'Beer-battered onion rings', price: 4.49, category: 'appetizer' },
    { name: 'Brownie Sundae', description: 'Warm brownie with ice cream', price: 6.99, category: 'dessert' },
  ],
  [
    { name: 'Salmon Nigiri', description: 'Fresh salmon over seasoned rice', price: 8.99, category: 'main' },
    { name: 'Edamame', description: 'Steamed soybeans with sea salt', price: 3.99, category: 'appetizer' },
    { name: 'Miso Soup', description: 'Traditional Japanese miso soup', price: 2.99, category: 'side' },
    { name: 'Green Tea', description: 'Hot Japanese green tea', price: 1.99, category: 'beverage' },
    { name: 'Mochi Ice Cream', description: 'Assorted mochi ice cream', price: 5.99, category: 'dessert' },
  ],
  [
    { name: 'Margherita Pizza', description: 'Tomato, mozzarella, and basil', price: 12.99, category: 'main' },
    { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 4.99, category: 'appetizer' },
    { name: 'Caesar Salad', description: 'Romaine, parmesan, croutons', price: 7.49, category: 'side' },
    { name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 6.99, category: 'dessert' },
    { name: 'Espresso', description: 'Double shot espresso', price: 2.49, category: 'beverage' },
  ],
];

async function seed() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    await MenuItem.deleteMany({});
    await Restaurant.deleteMany({});
    await Tenant.deleteMany({});
    console.log('Cleared existing data');

    const createdTenants = await Tenant.insertMany(tenants);
    console.log(`Created ${createdTenants.length} tenants`);

    let restaurantIndex = 0;
    for (let t = 0; t < createdTenants.length; t++) {
      const tenant = createdTenants[t];
      const restaurantDefs = restaurantsPerTenant[t];

      for (const restDef of restaurantDefs) {
        const restaurant = await Restaurant.create({ ...restDef, tenant: tenant._id });
        console.log(`  Created restaurant: ${restaurant.name} (tenant: ${tenant.slug})`);

        const items = menuItemsByRestaurant[restaurantIndex].map((item) => ({
          ...item,
          tenant: tenant._id,
          restaurant: restaurant._id,
        }));
        await MenuItem.insertMany(items);
        console.log(`    Added ${items.length} menu items`);

        restaurantIndex++;
      }
    }

    console.log('\nSeed completed successfully!');
    console.log('\nTenant IDs for testing:');
    createdTenants.forEach((t) => {
      console.log(`  ${t.name}: ${t._id}`);
    });
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
