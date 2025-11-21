import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import {
  getUsers,
  createUser,
  updateUser,
  UpdateUserDto,
  deleteUser,
  User
} from '../../services/UserService';
import { connectUserWs, disconnectUserWs } from '../../services/userWsService';

import Sidebar from '../../components/Sidebar/Sidebar_CS';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Spin,
  Alert,
  message,
  Select,
} from 'antd';

const { Column } = Table;

const GestionComptes: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [utilisateursActifs, setUtilisateursActifs] = useState<User[]>([]);
  const stompClientRef = useRef<Client | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement en temps réel des utilisateurs actifs
  useEffect(() => {
    connectUserWs(setUtilisateursActifs);
    return () => {
      disconnectUserWs();
    };
  }, []);

  // Récupérer tous les utilisateurs
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data || []);
      setError(null);
    } catch {
      setError('Erreur lors du chargement des utilisateurs');
      setUsers([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };
    loadData();
  }, []);

  // Ouvrir le modal pour ajouter ou modifier
  const handleOpenModal = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      form.setFieldsValue(user);
    } else {
      setSelectedUser(null);
      form.resetFields();
    }
    setOpenModal(true);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Soumission du formulaire (ajout ou modification)
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedUser) {
        // Mise à jour
        const userToSend: UpdateUserDto = { ...values };
        await updateUser(selectedUser.id_user, userToSend);
        message.success('Utilisateur modifié avec succès');
      } else {
        // Création
        await createUser(values);
        message.success('Utilisateur créé avec succès');
      }
      fetchUsers();
      setOpenModal(false);
    } catch (error) {
      message.error("Erreur lors de l'enregistrement de l'utilisateur");
    }
  };

  // Supprimer un utilisateur
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success('Utilisateur supprimé avec succès');
      fetchUsers();
    } catch (error) {
      message.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  if (loading) {
    return (
      <Sidebar>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar>
        <div style={{ padding: '20px' }}>
          <Alert message={error} type="error" showIcon />
          <Button
            type="primary"
            style={{ marginTop: '10px' }}
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2>Gestion des Comptes</h2>
          <Button type="primary" onClick={() => handleOpenModal()}>Ajouter un compte</Button>
        </div>

        <Table dataSource={users} rowKey="id_user" pagination={{ pageSize: 5 }}>
          <Column
            title=""
            key="avatar"
            render={(user: User) => (
              <div
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: '#1677ff',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: 16,
                  position: 'relative',
                }}
              >
                {user.prenom.charAt(0).toUpperCase()}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 10,
                    height: 10,
                    backgroundColor: utilisateursActifs.some(activeUser => activeUser.id_user === user.id_user)
                      ? 'green'
                      : 'gray',
                    borderRadius: '50%',
                    border: '2px solid white',
                  }}
                />
              </div>
            )}
          />
          <Column title="Nom" dataIndex="nom" key="nom" />
          <Column title="Prénom" dataIndex="prenom" key="prenom" />
          <Column title="Email" dataIndex="email" key="email" />
          <Column
            title="Rôle"
            dataIndex="role"
            key="role"
            render={(role: string) => {
              const rolesMap: Record<string, string> = {
                SECRETAIRE: 'Secrétaire',
                CHEF_DE_SERVICE: 'Chef de service'
              };
              return rolesMap[role] || role;
            }}
          />
          <Column
            title="Actions"
            key="actions"
            render={(user: User) => (
              <>
                <Button type="link" onClick={() => handleOpenModal(user)}>Modifier</Button>
                <Button type="link" danger onClick={() => handleDelete(user.id_user)}>Supprimer</Button>
              </>
            )}
          />
        </Table>

        <Modal
          title={selectedUser ? 'Modifier le compte' : 'Créer un nouveau compte'}
          visible={openModal}
          onCancel={handleCloseModal}
          onOk={handleSubmit}
          okText={selectedUser ? 'Modifier' : 'Créer'}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="nom"
              label="Nom"
              rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="prenom"
              label="Prénom"
              rules={[{ required: true, message: 'Veuillez saisir le prénom' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Veuillez saisir un email valide' }]}
            >
              <Input />
            </Form.Item>
            {!selectedUser && (
              <Form.Item
                name="password"
                label="Mot de passe"
                rules={[{ required: true, message: 'Veuillez saisir un mot de passe' }]}
              >
                <Input.Password />
              </Form.Item>
            )}
            
            <Form.Item 
              name="role"
              label="Rôle"
              rules={[{ required: true, message: 'Veuillez saisir le rôle' }]}>
              <Select>
                <Select.Option value="SECRETAIRE">Secrétaire</Select.Option>
                <Select.Option value="CHEF_DE_SERVICE">Chef de service</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default GestionComptes;
