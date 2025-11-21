import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ConfigProvider, theme, Button } from 'antd';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import './styles/theme.css';
import Login from "./pages/Login";
import Accueil_CS from "./pages/ChefService/Accueil_CS";
import Accueil_Sec from "./pages/Accueil_Sec";
import Unauthorized from "./pages/Unauthorized";
import List_AO from "./pages/Secretaire/List_Docs/List_AO";
import List_Marche from "./pages/Secretaire/List_Docs/List_Marche";
import Add_Marche from "./pages/Secretaire/Add_Docs/Add_Marche";
import Add_AO from "./pages/Secretaire/Add_Docs/Add_AO";
import Add_OS from "./pages/Secretaire/Add_Docs/Add_OS";
import List_OS from "./pages/Secretaire/List_Docs/List_OS";
import RoleProtectedRoute from "./utils/RoleProtectedRoute";
import Add_Notification from "./pages/Secretaire/Add_Docs/Add_Notification";
import List_Notification from "./pages/Secretaire/List_Docs/List_Notification";
import Add_Decompte from "./pages/Secretaire/Add_Docs/Add_Decompte";
import List_Decompte from "./pages/Secretaire/List_Docs/List_Decomptes";
import Add_PV from "./pages/Secretaire/Add_Docs/Add_PvReception";
import List_PV from "./pages/Secretaire/List_Docs/List_PvReceptions";
import Add_Societe from "./pages/Secretaire/Add_Docs/Add_Societe";
import List_Societe from "./pages/Secretaire/List_Docs/List_Societe";
import GestionComptes from "./pages/ChefService/GestionComptes";
import Dashboard from "./pages/ChefService/Dashboard";
import DocAO from "./pages/ChefService/Doc/DocAO";
import DocOS from "./pages/ChefService/Doc/DocOS";
import DocNotif from "./pages/ChefService/Doc/DocNotif";
import DocDecompte from "./pages/ChefService/Doc/DocDecompte";
import Notifications from "./pages/ChefService/Notifications";
import DocMarche from "./pages/ChefService/Doc/DocMarche";
import DocPV from "./pages/ChefService/Doc/DocPV";
import AddMarche from "./pages/ChefService/Add/Add_Marche";
import AddAO from "./pages/ChefService/Add/Add_AO";
import AddNotification from "./pages/ChefService/Add/Add_Notification";
import AddDecompte from "./pages/ChefService/Add/Add_Decompte";
import AddPV from "./pages/ChefService/Add/Add_PvReception";
import AddOS from "./pages/ChefService/Add/Add_OS";
import AddSociete from "./pages/ChefService/Add/AddSociete";
import DocSociete from "./pages/ChefService/Doc/DocSociete";

function AppContent() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const location = useLocation();
  const isLoginPage = location.pathname === "/" || location.pathname === "/login";

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', listener);
    return () => darkModeQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.body.className = isDarkMode ? 'theme-dark' : 'theme-light';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };


  //const themeIcon = isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />;
  const Icon = (isDarkMode ? HiOutlineSun : HiOutlineMoon) as React.ElementType;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div className={`app-container ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
        {!isLoginPage && (
          <div style={{
            position: 'fixed',
            top: '70px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <Button
              type="text"
             // icon={isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
            // icon={React.createElement(isDarkMode ? HiOutlineSun : HiOutlineMoon)} //caster l'icone manuellement
              icon={<Icon />}
              onClick={toggleTheme}
              style={{ color: isDarkMode ? '#fff' : '#000' }}
            />
          </div>
        )}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route element={<RoleProtectedRoute allowedRoles={["CHEF_DE_SERVICE"]} />}>
            <Route path="/accueil-chef" element={<Accueil_CS />} />
            <Route path="/DocMarche" element={<DocMarche />} />
            <Route path="/gestionComptes" element={<GestionComptes />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/DocAO" element={<DocAO />} />
            <Route path="/DocOS" element={<DocOS />} />
            <Route path="/DocNotif" element={<DocNotif />} />
            <Route path="/DocDecompte" element={<DocDecompte />} />
            <Route path="/Notifications" element={<Notifications />} />
            <Route path="/DocPV" element={<DocPV />} />
            <Route path="/AddAO" element={<AddAO />} />
            <Route path="/AddMarche" element={<AddMarche />} />
            <Route path="/AddOs" element={<AddOS />} />
            <Route path="/AddNotification" element={<AddNotification />} />
            <Route path="/AddPV" element={<AddPV />} />
            <Route path="/AddDecompte" element={<AddDecompte />} />
            <Route path="/AddSociete" element={<AddSociete />} />
            <Route path="/DocSociete" element={<DocSociete />} />
          </Route>
          <Route element={<RoleProtectedRoute allowedRoles={["SECRETAIRE"]} />}>
            <Route path="/accueil-secretaire" element={<Accueil_Sec />} />
            <Route path="/Add_AO" element={<Add_AO />} />
            <Route path="/AO" element={<List_AO />} />
            <Route path="/Add_Marche" element={<Add_Marche />} />
            <Route path="/Marche" element={<List_Marche />} />
            <Route path="/Add_Os" element={<Add_OS />} />
            <Route path="/OrdreService" element={<List_OS />} />
            <Route path="/Add_Notification" element={<Add_Notification />} />
            <Route path="/Notification" element={<List_Notification />} />
            <Route path="/Add_PV" element={<Add_PV />} />
            <Route path="/PV" element={<List_PV />} />
            <Route path="/Add_Decompte" element={<Add_Decompte />} />
            <Route path="/Decompte" element={<List_Decompte />} />
            <Route path="/Add_Societe" element={<Add_Societe />} />
            <Route path="/Societe" element={<List_Societe />} />
          </Route>
        </Routes>
      </div>
    </ConfigProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
