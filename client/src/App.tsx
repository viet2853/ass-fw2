import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import MainAdmin from "./pages/admin/Main";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import NotFound from "./pages/NotFound";
import MainLayout from "./layout";
import AdminLayout from "./layout/AdminLayout";
import UsersAdmin from "./pages/admin/UserAdmin";
import { getProfileFromLS } from "./utils";
import { useEffect, useState } from "react";

function App() {
  const [profile, setProfile] = useState(getProfileFromLS());
  useEffect(() => {
    setProfile(getProfileFromLS());
  }, []);

  function AdminWrapper() {
    return profile.user.role === "admin" ? <Outlet /> : <Navigate to="/" />;
  }

  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        ></Route>
        <Route
          path="products/:id"
          element={
            <MainLayout>
              <ProductDetail />
            </MainLayout>
          }
        ></Route>
        <Route path="signin" element={<Login />}></Route>
        <Route path="signup" element={<Register />}></Route>
      </Route>
      <Route element={<AdminWrapper />}>
        <Route
          path="admin"
          element={
            <AdminLayout>
              <MainAdmin />
            </AdminLayout>
          }
        />
        <Route
          path="admin/products"
          element={
            <AdminLayout>
              <ProductsAdmin />
            </AdminLayout>
          }
        />
        <Route
          path="admin/categories"
          element={
            <AdminLayout>
              <CategoriesAdmin />
            </AdminLayout>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminLayout>
              <UsersAdmin />
            </AdminLayout>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
