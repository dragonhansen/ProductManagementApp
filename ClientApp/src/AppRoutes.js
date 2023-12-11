import AddAndEditProduct from "./components/AddAndEditProduct";
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
  },
  {
    path: '/add-edit-product',
    element: <AddAndEditProduct />
  }
];

export default AppRoutes;
