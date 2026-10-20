// SEO text helpers. Product descriptions are generated from the product name + shop details,
// so every product page gets unique, keyword-rich copy without editing products.js by hand.
export function productDescription(product) {
  return `Buy ${product.name} online – handmade terracotta clay diya (agal vilakku) for pooja, Deepavali and Karthigai Deepam. Made in Virudhachalam, Cuddalore, Tamil Nadu. Delivery across India.`;
}

export function productLongText(product) {
  return `${product.name} is a handcrafted clay agal vilakku made by Alayam Pooja Products in Virudhachalam, Cuddalore district, Tamil Nadu. ` +
    `Ideal for daily pooja, Deepavali, Karthigai Deepam, housewarming, weddings and gifting. ` +
    `Each hand-shaped terracotta diya is eco-friendly and unique. Order on WhatsApp for delivery anywhere in India.`;
}
