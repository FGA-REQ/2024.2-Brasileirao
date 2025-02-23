import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // Defines the home page "/"
  route("/login", "routes/login.tsx"), // Defines "/login"
  route("/register", "routes/register.tsx"),
  route("/dashboard", "routes/dashboard.tsx"), // Add this line
  route("/products/:id", "routes/productPage.tsx"), // Add this line!
  route("/rentals", "routes/rentals.tsx"), // Add this line!
  route("/rentals/:id", "routes/rentalPage.tsx"), // Add this line!
  route("/profile/:id", "routes/profile.tsx"), // Add this line!
] satisfies RouteConfig;