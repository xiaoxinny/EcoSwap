import React, { useState, useEffect } from 'react';
import http from '../http';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TableSortLabel, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('email');
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await http.get('/user/showusers');
      const allUsers = response.data.users;
      const userAccounts = allUsers.filter(user => user.role === 'user');
      setUsers(userAccounts);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) {
      return;
    }

    try {
      await http.delete(`/user/showusers/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`);
  };

  const handleSort = (property) => {
    const isAscending = orderBy === property && order === 'asc';
    setOrder(isAscending ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase()); // Update search query
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery) // Filter based on search query
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valueA = a[orderBy] != null ? String(a[orderBy]) : ''; // Convert to string if not null
    let valueB = b[orderBy] != null ? String(b[orderBy]) : ''; // Convert to string if not null
  
    if (order === 'asc') {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  return (
    <div>
      <h2>User's Account</h2>
      <TextField
        label="Search Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ width: '520px' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={order}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'username'}
                  direction={order}
                  onClick={() => handleSort('username')}
                >
                  Username
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'contactNumber'}
                  direction={order}
                  onClick={() => handleSort('contactNumber')}
                >
                  Contact Number
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'dateOfBirth'}
                  direction={order}
                  onClick={() => handleSort('dateOfBirth')}
                >
                  Date of Birth
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'location'}
                  direction={order}
                  onClick={() => handleSort('location')}
                >
                  Location
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.contactNumber}</TableCell>
                <TableCell>{user.dateOfBirth}</TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(user.id)}
                    style={{ backgroundColor: 'red' }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(user.id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
