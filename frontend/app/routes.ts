import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // Defines the home page "/"
  route("/login", "routes/login.tsx"), // Defines "/login"
  route("/dashboard", "routes/dashboard.tsx"), // Add this line
] satisfies RouteConfig;