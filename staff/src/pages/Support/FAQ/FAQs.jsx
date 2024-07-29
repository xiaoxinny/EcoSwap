import React, { useEffect, useState } from "react";
import http from "../../../http.js";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Stack,
  Checkbox,
  TableSortLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function FAQ() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const addNavigation = () => {
    navigate("/add-faq");
  };

  const editNavigation = (id) => {
    navigate(`/edit-faq/${id}`);
  };

  useEffect(() => {
    http.get("/faqs").then((res) => {
      setFaqs(res.data);
    });
  }, []);

  // Opens the delete confirmation dialog
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  // Closes the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Handles deleting selected rows
  const handleDelete = async () => {
    try {
      await Promise.all(selected.map((id) => http.delete(`/faqs/${id}`)));
      setFaqs(faqs.filter((faq) => !selected.includes(faq.id)));
      setSelected([]);
      console.log(`Selected FAQs deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting selected FAQs:`, error);
    } finally {
      handleCloseDeleteDialog(); // Close dialog after deletion
    }
  };

  // Handles selecting all rows
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(faqs.map((faq) => faq.id));
      return;
    }
    setSelected([]);
  };

  // Handles selecting a single row
  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  // Sets the sorting order and column
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Sorts the FAQs based on the order and column
  const sortedFaqs = [...faqs].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    } else if (orderBy === "created_at") {
      return order === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }
    return 0;
  });

  // Handler for changing page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handler for setting number of row to display per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Formats date to only display MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <Container sx={{ height: "50vh" }}>
        <h1>FAQ Management</h1>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mb={2}>
          <Button
            onClick={addNavigation}
            variant="contained"
            sx={{
              backgroundColor: "#000000",
              color: "white",
              "&:hover": {
                backgroundColor: "darkgrey",
              },
            }}
          >
            Add FAQ
          </Button>
          {selected.length > 0 && (
            <Button
              onClick={handleOpenDeleteDialog}
              variant="contained"
              sx={{
                backgroundColor: "#ff0000", // Red for delete
                color: "white",
                "&:hover": {
                  backgroundColor: "#cc0000", // Darker red for hover
                },
              }}
            >
              Delete Selected
            </Button>
          )}
        </Stack>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selected.length > 0 && selected.length < faqs.length
                      }
                      checked={
                        faqs.length > 0 && selected.length === faqs.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "id"}
                      direction={orderBy === "id" ? order : "asc"}
                      onClick={() => handleRequestSort("id")}
                    >
                      #
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "question"}
                      direction={orderBy === "question" ? order : "asc"}
                      onClick={() => handleRequestSort("question")}
                    >
                      Question
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "category"}
                      direction={orderBy === "category" ? order : "asc"}
                      onClick={() => handleRequestSort("category")}
                    >
                      Category
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "created_at"}
                      direction={orderBy === "created_at" ? order : "asc"}
                      onClick={() => handleRequestSort("created_at")}
                    >
                      Created On
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedFaqs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((faq, index) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={faq.id}
                      selected={selected.indexOf(faq.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.indexOf(faq.id) !== -1}
                          onChange={() => handleClick(faq.id)}
                        />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{faq.question}</TableCell>
                      <TableCell>{faq.category}</TableCell>
                      <TableCell>{formatDate(faq.created_at)}</TableCell>
                      <TableCell>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                        >
                          <Button
                            onClick={() => editNavigation(faq.id)}
                            variant="contained"
                            sx={{
                              backgroundColor: "#000000",
                              color: "white",
                              "&:hover": { backgroundColor: "darkgrey" },
                            }}
                          >
                            Edit
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={faqs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
      <Container sx={{ height: "50vh" }}>
        <h1>History</h1>
        <Paper sx={{ width: "100%", overflow: "hidden" }}></Paper>
      </Container>
      {/* Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the selected FAQs?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FAQ;
