// API route for new arrivals
import { products } from "./products";



export default function handler(req, res) {
  // Filter some products as new arrivals (for demo purposes)
  const newProducts = products.filter((product, index) => index % 4 === 1).slice(0, 8);

  res.status(200).json(newProducts);
}
