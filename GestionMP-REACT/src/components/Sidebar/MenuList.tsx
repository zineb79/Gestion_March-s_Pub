import { Menu } from 'antd'
import {HomeOutlined} from '@ant-design/icons';
import {SettingOutlined} from '@ant-design/icons';
import {FileTextOutlined} from '@ant-design/icons';
import {LogoutOutlined} from '@ant-design/icons';
import {BellOutlined} from '@ant-design/icons';
import {TeamOutlined} from '@ant-design/icons';
import {ProductOutlined} from '@ant-design/icons';
import './sidebar.css';
import React from 'react'

const MenuList: React.FC = () => {
  return (
    <Menu mode='inline' className='menubar'>
        <Menu.Item key="Home" icon= {<HomeOutlined />}>Accueil</Menu.Item>
        <Menu.Item key="dashboard" icon= {<ProductOutlined />}>Tableau de bord</Menu.Item>
        <Menu.SubMenu key="Doc" icon= {<FileTextOutlined />} title="Documents">
            <Menu.Item key="AO">Appel d'offre</Menu.Item>
            <Menu.Item key="NA">Notification d'approbation</Menu.Item>
            <Menu.SubMenu key="OS" title="Ordre de  service">
                <Menu.Item key="OSC">de commencement</Menu.Item>
                <Menu.Item key="OSA">d'arret</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="" title="PV de réception">
                <Menu.Item key="PVP"> provisoire</Menu.Item>
                <Menu.Item key="PVD"> définitive</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="Decompte">Décompte</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="notif" icon= {<BellOutlined />}>Notification</Menu.Item>
        <Menu.Item key="setting" icon= {<SettingOutlined />}>Paramétre</Menu.Item>
        <Menu.Item key="membre" icon= {<TeamOutlined />}>Comptes secrétaires</Menu.Item>
        <Menu.Item key="deconnexion" icon= {<LogoutOutlined />}>se déconnecter</Menu.Item>
    </Menu>
  )
}

export default MenuList