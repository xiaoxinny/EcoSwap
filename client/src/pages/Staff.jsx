//Diplay all staff (if u dont want staff to delete staff just remove the button)
import React, { useState, useEffect } from 'react';
import http from '../http';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TableSortLabel, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('email');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await http.get('/staff/showstaff');
      const allStaff = response.data.staff;
      const staffAccounts = allStaff.filter(staff => staff.role === 'staff');
      setStaff(staffAccounts);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this staff member?");
    if (!confirmed) {
      return;
    }

    try {
      await http.delete(`/staff/showstaff/${id}`);
      setStaff(staff.filter(staff => staff.id !== id));
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const handleSort = (property) => {
    const isAscending = orderBy === property && order === 'asc';
    setOrder(isAscending ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredStaff = staff.filter(staff =>
    staff.username.toLowerCase().includes(searchQuery)
  );

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    let valueA = a[orderBy] != null ? String(a[orderBy]) : '';
    let valueB = b[orderBy] != null ? String(b[orderBy]) : '';
    
    if (order === 'asc') {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  return (
    <div>
      <h2>Staff's Account</h2>
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStaff.map(staff => (
              <TableRow key={staff.id}>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.username}</TableCell>
                <TableCell>{staff.contactNumber}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(staff.id)}
                    style={{ backgroundColor: 'red' }}
                  >
                    Delete
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

export default Staff;
