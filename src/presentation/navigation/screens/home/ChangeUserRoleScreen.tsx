import React, { useEffect, useState } from 'react';
import { Layout, Text, ListItem, Select, SelectItem, IndexPath, Button } from '@ui-kitten/components';
import { useUserStore } from '../../../store/useUserStore';
import { UserResponse } from '../../../../infrastucture/interfaces/user.responses';

export const ChangeUserRoleScreen = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<IndexPath | null>(null);
  const { getAll, changeRole } = useUserStore();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAll();
      if (fetchedUsers) {
        // Verifica que cada usuario tenga user_role definido
        const usersWithRoles = fetchedUsers.map(user => ({
          ...user,
          user_role: user.user_role || 'user' // Asigna un rol predeterminado si está indefinido
        }));
        setUsers(usersWithRoles);
      }
    };

    fetchUsers();
  }, [getAll]);

  const handleSelectedUser = (index: IndexPath) => {
    setSelectedUserIndex(index);
  };

  const handleChangeRole = async () => {
    if (selectedUserIndex !== null) {
      const selectedUser = users[selectedUserIndex.row];
      const isAdmin = selectedUser.user_role !== 'admin';
      const success = await changeRole(selectedUser._id, isAdmin);
      if (success) {
        setUsers(users.map(user =>
          user._id === selectedUser._id ? { ...user, user_role: isAdmin ? 'admin' : 'user' } : user
        ));
      }
    }
  };

  return (
    <Layout style={{ flex: 1, padding: 20 }}>
      <Text category='h1' style={{ marginBottom: 20 }}>Cambiar Rol de Usuario</Text>
      
      <Select
        label='Seleccione el Usuario'
        value={selectedUserIndex !== null && users[selectedUserIndex.row] ? users[selectedUserIndex.row].name : 'Seleccione un usuario'}
        selectedIndex={selectedUserIndex || []}
        onSelect={(index) => handleSelectedUser(index as IndexPath)}
        style={{ marginBottom: 20 }}
      >
        {users.map((user) => (
          <SelectItem key={user._id} title={user.name} />
        ))}
      </Select>

      {selectedUserIndex !== null && selectedUserIndex.row < users.length && (
        <Layout>
          <Text category='h6' style={{ marginBottom: 10 }}>Usuario Seleccionado:</Text>
          <ListItem
            title={`Nombre: ${users[selectedUserIndex.row].name}`}
            description={`Usuario: ${users[selectedUserIndex.row].username}\nCorreo: ${users[selectedUserIndex.row].email}\nRol: ${users[selectedUserIndex.row].user_role}`}
          />
          <Button onPress={handleChangeRole} style={{ marginTop: 20 }}>
            {`Cambiar a ${users[selectedUserIndex.row].user_role === 'admin' ? 'Usuario' : 'Admin'}`}
          </Button>
        </Layout>
      )}
    </Layout>
  );
};
