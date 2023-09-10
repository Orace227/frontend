import { useState } from 'react';
import { filter } from 'lodash';
import {
  Card,
  Table,
  Stack,
  Paper,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  // DialogActions,
  TextField,
  Grid
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { useEffect } from 'react';
import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
// const initialValues = {
//   clientId: 0,
//   familyMembers: 0,
//   firstName: '',
//   lastName: '',
//   email: '',
//   mobile: '',
//   dateOfBirth: '',
//   passportNumber: '',
//   passportExpiryDate: '',
//   frequentFlyerNumbers: [{ type: '', number: '' }],
//   hotelLoyaltyNumbers: [{ type: '', number: '' }],
//   address: '',
//   city: '',
//   country: '',
//   postalCode: '',
//   foodPreferences: '',
//   companyName: '',
//   companyGSTNumber: '',
//   companyGSTEmail: ''
// };
const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'relationship', label: 'relationship', alignRight: false },
  { id: 'Mobile', label: 'Mobile No', alignRight: false },
  { id: 'Email', label: 'Email', alignRight: false },
  { id: 'address', label: 'address', alignRight: false },
  { id: 'action', label: 'action' }
];

export default function GetFamilyMembers() {
  // const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [USERLIST, setUserlist] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedUserData, setEditedUserData] = useState([]);
  const [CLIENTID, setCLIENTID] = useState();
  const location = useLocation();

  const fetchFamilyMembers = async () => {
    const searchParams = new URLSearchParams(location.search);
    const queryParams = searchParams.get('clientId');
    setCLIENTID(queryParams);
    // console.log(queryParams)
    const url = `/getFamilyMembers?id=${queryParams}`;
    // console.log(url)
    const familyMembers = await axios.get(url);
    // console.log(familyMembers.data);
    const familyMembersData = familyMembers.data.allFamilyMembers;
    setUserlist(familyMembersData);
  };

  useEffect(() => {
    fetchFamilyMembers();
    // console.log(USERLIST);
    // eslint-disable-next-line
  }, []);

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // If the checkbox is checked, select all items
      const newSelecteds = USERLIST.map((n) => n.clientId);
      setSelected(newSelecteds);
    } else {
      // If the checkbox is unchecked, clear the selection
      setSelected([]);
    }
  };

  const handleClick = (event, FamilyMemberId) => {
    const selectedIndex = selected.indexOf(FamilyMemberId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If the item is not selected, add it to the selection
      newSelected = [...selected, FamilyMemberId];
    } else if (selectedIndex >= 0) {
      // If the item is selected, remove it from the selection
      newSelected = selected.filter((id) => id !== FamilyMemberId);
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleOpenEditModal = (row) => {
    try {
      console.log(row);
      const user = USERLIST.find((user) => user.clientId == row.clientId);
      console.log(user);
      setEditedUserData(user);
      setOpenEditModal(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleDeleteCustomer = async (row) => {
    try {
      const user = USERLIST.find((user) => user.FamilyMemberId == row.FamilyMemberId);
      console.log(user);
      const isDelete = window.confirm('Are you sure you want to delete customer having name ' + user.firstName + user.lastName);
      if (isDelete) {
        const deletedCustomer = await axios.post('/DeleteFamilyMember', { clientId: user.clientId, FamilyMemberId: user.FamilyMemberId });
        if (deletedCustomer) {
          toast.success('Customer deleted successfully!!');
        }
      }
      window.location.reload();
    } catch (err) {
      console.log({ error: err });
    }
  };
  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSaveChanges = () => {
    handleCloseEditModal();
  };
  const handleMobileKeyPress = (e) => {
    // Prevent non-numeric characters
    if (!/^\d+$/.test(e.key)) {
      e.preventDefault();
    }
  };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile must contain exactly 10 digits')
      .required('Mobile is required'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    passportNumber: Yup.string().required('Passport Number is required'),
    passportExpiryDate: Yup.date().required('Passport Expiry Date is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    postalCode: Yup.string().required('Postal Code is required'),
    frequentFlyerNumbers: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required('Frequent Flyer Type is required'),
        number: Yup.string().required('Frequent Flyer Number is required')
      })
    ),
    hotelLoyaltyNumbers: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required('Hotel Loyalty Type is required'),
        number: Yup.string().required('Hotel Loyalty Number is required')
      })
    )
  });
  const handleSubmit = async () => {
    // console.log(editedUserData);
    const updatedCustomer = await axios.post('/updateFamilyMember', editedUserData);
    console.log(updatedCustomer);
    toast.success('Family Member updated successfully!!');
    handleSaveChanges();
    window.location.reload();
    // console.log(createdUser);
    // window.location.reload();
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h1" gutterBottom>
            Family Members
          </Typography>
          <Button
            component={Link}
            to={`/createFamilyMembers?clientId=${CLIENTID}`}
            variant="contained"
            style={{ textAlign: 'center' }}
            color="primary"
          >
            Add Family members
          </Button>
        </Stack>
        <Toaster />
        {openEditModal && (
          <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="xs" fullWidth>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogContent>
              <Container>
                <Formik initialValues={editedUserData} validationSchema={validationSchema} onSubmit={handleSubmit}>
                  {(
                    { values } // Use values from Formik props
                  ) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="firstName"
                            as={TextField}
                            label="First Name"
                            value={editedUserData.firstName || ' '}
                            onChange={(e) => {
                              const updatedUserData = { ...editedUserData, firstName: e.target.value };
                              setEditedUserData(updatedUserData);
                            }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="firstName" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="lastName"
                            as={TextField}
                            label="Last Name"
                            value={editedUserData.lastName || ' '}
                            onChange={(e) => {
                              const updatedUserData = { ...editedUserData, lastName: e.target.value };
                              setEditedUserData(updatedUserData);
                            }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="lastName" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="relationship"
                            as={TextField}
                            label="relationship"
                            value={editedUserData.relationship || ' '}
                            onChange={(e) => {
                              const updatedUserData = { ...editedUserData, relationship: e.target.value };
                              setEditedUserData(updatedUserData);
                            }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="relationship" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="email"
                            as={TextField}
                            value={editedUserData.email || ' '}
                            onChange={(e) => {
                              const updatedUserData = { ...editedUserData, email: e.target.value };
                              setEditedUserData(updatedUserData);
                            }}
                            label="Email"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="email" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="mobile"
                            as={TextField}
                            label="Mobile"
                            type="text"
                            value={editedUserData.mobile || ' '}
                            onChange={(e) => {
                              handleMobileKeyPress(e);
                              const updatedUserData = { ...editedUserData, mobile: e.target.value };
                              setEditedUserData(updatedUserData);
                            }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            inputProps={{
                              inputMode: 'numeric',
                              maxLength: 10 // Add maximum length attribute
                            }}
                          />
                          <ErrorMessage name="mobile" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="dateOfBirth"
                            as={TextField}
                            label="Date of Birth"
                            // onChange={(e) => {
                            //   console.log(editedUserData.dateOfBirth.split("T"))
                            //   const inputValue = e.target.value;
                            //   const formattedDate = inputValue.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$2-dd'); // Replace "dd" with "gg"
                            //   const updatedUserData = { ...editedUserData, dateOfBirth: formattedDate };
                            //   setEditedUserData(updatedUserData);
                            // }}
                            type="date"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                          <ErrorMessage name="dateOfBirth" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            name="passportNumber"
                            as={TextField}
                            value={editedUserData.passportNumber || ' '}
                            onChange={(e) => {
                              const updatedUserData = { ...editedUserData, passportNumber: e.target.value };
                              setEditedUserData(updatedUserData);
                            }}
                            label="Passport Number"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="passportNumber" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="passportExpiryDate"
                            as={TextField}
                            value={editedUserData?.passportExpiryDate || ''}
                            onChange={(e) => {
                              const updatedUserData = { ...editedUserData, passportExpiryDate: e.target.value };
                              setEditedUserData(updatedUserData);
                            }}
                            label="Passport Expiry Date"
                            type="date"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true
                            }}
                            inputProps={{
                              pattern: '\\d{4}-\\d{2}-\\d{2}' // Ensure the date is in yyyy-mm-dd format
                            }}
                          />
                          <ErrorMessage name="passportExpiryDate" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="h5" gutterBottom>
                            Frequent Flyer Numbers
                          </Typography>
                          <FieldArray name="frequentFlyerNumbers">
                            {({ push, remove }) => (
                              <div>
                                {values.frequentFlyerNumbers.map((ffNumber, index) => (
                                  <div key={index}>
                                    <Field
                                      name={`frequentFlyerNumbers[${index}].type`}
                                      as={TextField}
                                      label="Frequent Flyer Type"
                                      value={editedUserData?.frequentFlyerNumbers[index]?.type || ' '}
                                      onChange={(e) => {
                                        console.log('Change event triggered'); // Debugging line
                                        const updatedUserData = { ...editedUserData };
                                        const frequentFlyerNumbers = [...updatedUserData.frequentFlyerNumbers];
                                        frequentFlyerNumbers[index].type = e.target.value;
                                        console.log('Updated type:', e.target.value); // Debugging line
                                        updatedUserData.frequentFlyerNumbers = frequentFlyerNumbers;
                                        setEditedUserData(updatedUserData);
                                      }}
                                      fullWidth
                                      margin="normal"
                                      variant="outlined"
                                    />

                                    <Field
                                      name={`frequentFlyerNumbers[${index}].number`}
                                      as={TextField}
                                      label="Frequent Flyer Number"
                                      value={editedUserData?.frequentFlyerNumbers[index]?.number || ' '}
                                      onChange={(e) => {
                                        const updatedUserData = { ...editedUserData };
                                        const frequentFlyerNumbers = [...updatedUserData.frequentFlyerNumbers];
                                        console.log(frequentFlyerNumbers)
                                        frequentFlyerNumbers[index].number = e.target.value;
                                        updatedUserData.frequentFlyerNumbers = frequentFlyerNumbers;
                                        setEditedUserData(updatedUserData);
                                      }}
                                      fullWidth
                                      margin="normal"
                                      variant="outlined"
                                    />
                                    <ErrorMessage
                                      name={`frequentFlyerNumbers[${index}].number`}
                                      component="div"
                                      className="error"
                                      style={{ color: 'red' }}
                                    />
                                    <Button type="button" variant="outlined" color="secondary" onClick={() => remove(index)}>
                                      Remove Frequent Flyer
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outlined"
                                  style={{ marginTop: '10px' }}
                                  onClick={() => {
                                    updateFrequentFlyerNumbers = [push({ type: ' ', number: ' ' })] 
                                    setEditedUserData(updateFrequentFlyerNumbers);

                                  }}
                                >
                                  Add Frequent Flyer
                                </Button>
                              </div>
                            )}
                          </FieldArray>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h5" gutterBottom>
                            Hotel Loyalty Numbers
                          </Typography>
                          <FieldArray name="hotelLoyaltyNumbers">
                            {({ push, remove }) => (
                              <>
                                <div>
                                  {editedUserData.hotelLoyaltyNumbers.map((hlNumber, index) => (
                                    <div key={index}>
                                      <Field
                                        name={`hotelLoyaltyNumbers[${index}].type`}
                                        as={TextField}
                                        label="Hotel Loyalty Type"
                                        value={editedUserData?.hotelLoyaltyNumbers[index]?.type || ' '}
                                        onChange={(e) => {
                                          const updatedUserData = { ...editedUserData };
                                          const hotelLoyaltyNumbers = [...updatedUserData.hotelLoyaltyNumbers];
                                          hotelLoyaltyNumbers[index].type = e.target.value;
                                          updatedUserData.hotelLoyaltyNumbers = hotelLoyaltyNumbers;
                                          setEditedUserData(updatedUserData);
                                        }}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                      />
                                      <ErrorMessage
                                        name={`hotelLoyaltyNumbers[${index}].type`}
                                        component="div"
                                        className="error"
                                        style={{ color: 'red' }}
                                      />
                                      <Field
                                        name={`hotelLoyaltyNumbers[${index}].number`}
                                        as={TextField}
                                        label="Hotel Loyalty Number"
                                        value={editedUserData?.hotelLoyaltyNumbers[index]?.number || ' '}
                                        onChange={(e) => {
                                          const updatedUserData = { ...editedUserData };
                                          const hotelLoyaltyNumbers = [...updatedUserData.hotelLoyaltyNumbers];
                                          hotelLoyaltyNumbers[index].number = e.target.value;
                                          updatedUserData.hotelLoyaltyNumbers = hotelLoyaltyNumbers;
                                          setEditedUserData(updatedUserData);
                                        }}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                      />
                                      <ErrorMessage
                                        name={`hotelLoyaltyNumbers[${index}].number`}
                                        component="div"
                                        className="error"
                                        style={{ color: 'red' }}
                                      />
                                      <Button type="button" variant="outlined" color="secondary" onClick={() => remove(index)}>
                                        Remove Hotel Loyalty
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outlined"
                                    style={{ marginTop: '10px' }}
                                    onClick={() => push({ type: ' ', number: ' ' })}
                                  >
                                    Add Hotel Loyalty
                                  </Button>
                                </div>
                              </>
                            )}
                          </FieldArray>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="address"
                            value={editedUserData.address || ' '}
                            onChange={(e) => {
                              const updatedUserData = { ...editedUserData, address: e.target.value };
                              setEditedUserData(updatedUserData);
                            }}
                            as={TextField}
                            label="Address"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="address" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="city"
                            as={TextField}
                            value={editedUserData.city || ' '}
                            onChange={(e) => {
                              const updatedUserData = { ...editedUserData, city: e.target.value };
                              setEditedUserData(updatedUserData);
                            }}
                            label="City"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="city" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="country"
                            value={editedUserData.country || ''}
                            onChange={(e) => {
                              const updatedUserData = { ...editedUserData, country: e.target.value };
                              setEditedUserData(updatedUserData);
                            }}
                            as={TextField}
                            label="Country"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="country" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="postalCode"
                            value={editedUserData.postalCode || ''}
                            onChange={(e) => {
                              const updatedUserData = { ...editedUserData, postalCode: e.target.value };
                              setEditedUserData(updatedUserData);
                            }}
                            as={TextField}
                            label="Postal Code"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                          <ErrorMessage name="postalCode" component="div" className="error" style={{ color: 'red' }} />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="foodPreferences"
                            as={TextField}
                            label="Food Preferences"
                            fullWidth
                            value={editedUserData.foodPreferences || ''}
                            onChange={(e) => {
                              const updatedUserData = { ...editedUserData, foodPreferences: e.target.value };
                              setEditedUserData(updatedUserData);
                            }}
                            margin="normal"
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                      <Button type="submit" variant="contained" color="primary" size="large" style={{ marginTop: '1rem' }}>
                        Save
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Container>
            </DialogContent>
          </Dialog>
        )}
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    // console.log(row);
                    const { FamilyMemberId, firstName, lastName, email, mobile, address, relationship } = row;
                    // console.log(row)
                    const selectedUser = selected.indexOf(FamilyMemberId) !== -1;

                    return (
                      <>
                        <TableRow hover key={FamilyMemberId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, FamilyMemberId)} />
                          </TableCell>

                          <TableCell align="left">
                            <Typography noWrap>
                              {firstName} {lastName}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">{relationship}</TableCell>

                          <TableCell align="left">{mobile}</TableCell>

                          <TableCell align="left">{email}</TableCell>

                          <TableCell align="left">{address}</TableCell>

                          <TableCell align="left">
                            <IconButton size="large" color="inherit" onClick={() => handleOpenEditModal(row)}>
                              <Iconify icon={'eva:edit-fill'} />
                            </IconButton>

                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={() => {
                                handleDeleteCustomer(row);
                              }}
                            >
                              <Iconify icon={'eva:trash-2-outline'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
