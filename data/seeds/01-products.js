/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  knex('users').truncate();
  knex('products').truncate();
  knex('category').truncate();

  await knex('category').insert([
    { category: 'Jewelry' },
    { category: 'Baskets' },
    { category: 'Clothing' },
  ]);

  await knex('products')
    .insert([
      { product: 'Earrings', category_id: 1, description: 'Handmade beaded earrings', price: 25 },
      { product: 'Bangle', category_id: 1, description: 'Natural wood bangle', price: 10 },
      { product: 'Necklace', category_id: 1, description: 'Handmade beaded necklace', price: 30 },
      { product: 'Small Basket', category_id: 2, description: 'Small basket, weaved by hand', price: 10 },
      { product: 'Medium Basket', category_id: 2, description: 'Medium basket, weaved by hand', price: 20 },
      { product: 'Large Basket', category_id: 2, description: 'Large basket, weaved by hand', price: 30 },
      { product: 'Dress', category_id: 3, description: 'Traditional dress', price: 40 },
      { product: 'Shoes', category_id: 3, description: 'Traditional shoes', price: 25 },
      { product: 'Shawl', category_id: 3, description: 'Traditional shawl', price: 10 },
    ]);
  };
