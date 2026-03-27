import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import MaterialDetailPage from "@/pages/MaterialDetailPage";
import MaterialDemoPage from "@/pages/MaterialDemoPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/materials/:materialId" element={<MaterialDetailPage />} />
      </Route>
      <Route path="/materials/:materialId/demo" element={<MaterialDemoPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
