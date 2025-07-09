// API route for featured products
import { products } from '../../../data/products';

export default function handler(req, res) {
  // Filter some products as featured (for demo purposes)
  const featuredProducts = products.filter((product, index) => index % 3 === 0).slice(0, 8);
  
  res.status(200).json(featuredProducts);
}
