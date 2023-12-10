import { Home } from "./components/Home";
import ShowProducts from "./components/ShowProducts";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/show-products',
    element: <ShowProducts />
  }
];

export default AppRoutes;
