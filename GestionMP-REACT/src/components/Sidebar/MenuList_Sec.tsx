import { useState } from 'react';
import { Menu } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  FileTextOutlined,
  LogoutOutlined,
  BellOutlined,
  BankOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";

interface MenuListProps {
  darkTheme?: boolean;
}

const MenuList: React.FC<MenuListProps> = ({ darkTheme = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    // Détermine l'item sélectionné en fonction de la route actuelle
    const path = location.pathname;
    if (path.includes("accueil-secretaire")) return "Home";
    if (path.includes("AO")) return "AO";
    if (path.includes("Marche")) return "marche";
    if (path.includes("OrdreService")) return "OS";
    if (path.includes("Notification")) return "NOT";
    if (path.includes("PV")) return "PV";
    if (path.includes("Decompte")) return "Decompte";
    if (path.includes("Societe")) return "Societe";
    return "Doc";
  });

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
    
    if (key === "deconnexion") {
      navigate("/login"); 
    } else if (key === "Home") {
      navigate("/accueil-secretaire"); 
    } else if (key === "AO") {
      navigate("/AO"); 
    } else if (key === "marche") {
      navigate("/Marche"); 
    } else if (key === "OS") {
      navigate("/OrdreService"); 
    } else if (key === "NOT") {
      navigate("/Notification"); 
    } else if (key === "PV") {
      navigate("/PV"); 
    } else if (key === "Decompte") {
      navigate("/Decompte"); 
    } else if (key === "Societe") {
      navigate("/Societe");
    }
  };

  const items = [
    { key: "Home", icon: <HomeOutlined />, label: "Accueil" },
    { key: "marche", icon: <BankOutlined />, label: "Marché" },
    {
      key: "Doc",
      icon: <FileTextOutlined />,
      label: "Documents",
      children: [
        { key: "AO", label: "Appel d'offre" },
        { key: "NOT", label: "Notification d'approbation" },
        { key: "OS", label: "Ordre de service" },
        { key: "PV", label: "PV de réception" },
        { key: "Decompte", label: "Décompte" },
      ],
    },
    {
      key: "Societe",
      icon: <TeamOutlined />,
      label: "Sociétés"
    },
    { key: "deconnexion", icon: <LogoutOutlined />, label: "Se déconnecter" },
  ];

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className="menubar"
      items={items}
      onClick={handleMenuClick}
      selectedKeys={[selectedKey]}
    />
  );
};

export default MenuList;