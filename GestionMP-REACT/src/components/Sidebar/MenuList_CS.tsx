import { Menu, Badge } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  FileTextOutlined,
  LogoutOutlined,
  BellOutlined,
  TeamOutlined,
  BankOutlined,
  CodepenOutlined,
  UserOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./sidebar.css";
import React from "react";
import api from "../../utils/axiosInstance";

interface MenuListProps {
  darkTheme?: boolean;
}

const MenuList: React.FC<MenuListProps> = ({ darkTheme = false }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    // Détermine l'item sélectionné en fonction de la route actuelle
    const path = location.pathname;
    if (path.includes("accueil-chef")) return "Home";
    if (path.includes("gestionComptes")) return "membre";
    if (path.includes("DocAO")) return "AO";
    if (path.includes("DocMarche")) return "marche";
    if (path.includes("DocNotif")) return "NA";
    if (path.includes("notifications")) return "notif";
    if (path.includes("Dashboard")) return "dashboard";
    if (path.includes("DocOS")) return "OS";
    if (path.includes("DocPV")) return "PV";
    if (path.includes("Societe")) return "Societe";
    if (path.includes("DocDecompte")) return "Decompte";
    return "Home";
  });

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const destinataireId = userData.id || 1;
  
        const { data } = await api.get(`/api/MarcheNotification/getUnreadCount?destinataire=${destinataireId}`);
  
        setUnreadCount(data); 
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre de notifications non lues", error);
      }
    };
  
    fetchUnreadCount();
  }, []);  
  
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "deconnexion") {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate("/login");
    }
    else if (key === "Home") {
      navigate("/accueil-chef");
    }
    else if (key === "marche") {
      navigate("/DocMarche");
    }
    else if (key === "membre") {
      navigate("/gestionComptes");
    }
    else if (key === "AO") {
      navigate("/DocAO");
    } else if (key === "Societe") {
      navigate("/DocSociete");
    }
    else if (key === "NA") {
      navigate("/DocNotif");
    }
    else if (key === "OS") {
      navigate("/DocOS");
    }
    else if (key === "PV") {
      navigate("/DocPV");
    }
    else if (key === "Decompte") {
      navigate("/DocDecompte");
    }
    else if (key === "dashboard") {
      navigate("/Dashboard");
    }
    else if (key === "notif") {
      navigate("/notifications");
    }
  };

  const items = [
    { key: "Home", icon: <HomeOutlined />, label: "Accueil" },
    { key: "dashboard", icon: <CodepenOutlined />, label: "Tableau de bord" },
    { key: "marche", icon: <BankOutlined />, label: "Marché" },
    {
      key: "Doc",
      icon: <FileTextOutlined />,
      label: "Documents",
      children: [
        { key: "AO", label: "Appel d'offre" },
        { key: "NA", label: "Notification d'approbation" },
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
    {
      key: "notif",
      icon: (
        <div style={{ minWidth: 24 }}>
          <Badge count={unreadCount} size="small" overflowCount={9}>
            <BellOutlined />
          </Badge>
        </div>
      ),      
      label: "Notification",
    },
    /*{ key: "setting", icon: <SettingOutlined />, label: "Paramètres" },*/
    { key: "membre", icon: <UserOutlined />, label: "Comptes secrétaires" },
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
