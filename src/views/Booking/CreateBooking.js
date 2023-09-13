import React from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, IconButton, FormLabel } from '@mui/material';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
// import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
// import axios from 'axios';

const validationSchema = Yup.object().shape({
  bookingId: Yup.number().required('Booking ID is required'),
  packageId: Yup.string().required('Package ID is required'),
  clientId: Yup.string().required('Client ID is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().required('End Date is required'),
  modifiedPackagePrice: Yup.number().required('Modified Package Price is required'),
  bookingDetails: Yup.array().of(
    Yup.object().shape({
      bookingType: Yup.string().required('Booking Type is required'),
      bookingName: Yup.string().required('Booking Name is required'),
      docImgName: Yup.string().required('Document Name is required'),
      docImg: Yup.mixed().required('Booking Document is required')
    })
  )
});

function generateSixDigitNumber() {
  const min = 100000; // Smallest 6-digit number
  const max = 999999; // Largest 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// const imgSchema =;

const defaultBookingDetail = {
  bookingType: '',
  bookingName: '',
  docImgName: '',
  docImg: {}
};

const initialValues = {
  bookingId: generateSixDigitNumber(),
  packageId: '',
  clientId: '',
  startDate: '',
  endDate: '',
  modifiedPackagePrice: '',
  bookingDetails: [defaultBookingDetail]
};

const CreateBooking = () => {
  const handleSubmit = async (values) => {
    const formData = new FormData();
    // console.log(values);
    formData.append('clientId', values.clientId);
    formData.append('bookingDetails', JSON.stringify(values.bookingDetails)); // Assuming bookingDetailsArray contains your data

    for (let i = 0; i < values.bookingDetails.length; i++) {
      formData.append('docImg', values.bookingDetails[i].docImg); // Add your image files to the formData
    }
    // console.log(formData);
    axios
      .post('/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        console.log('Response:', response.data);

        // axios.post("createBooking",)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // const handleMobileKeyPress = (event) => {
  //   // Prevent non-numeric characters
  //   if (!/^\d+$/.test(event.key)) {
  //     event.preventDefault();
  //   }
  // };

  return (
    <Container>
      <Typography variant="h2"style={{marginBottom:"15px"}} gutterBottom>
        Create Booking
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              {/* <Grid item xs={12} md={6}>
                <TextField fullWidth name="bookingId" label="Booking ID" variant="outlined" value={values.bookingId} disabled />
              </Grid> */}
              <Grid item xs={12} md={6}>
                <Field fullWidth name="packageId" as={TextField} label="Package ID" variant="outlined" />
                <ErrorMessage name="packageId" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field fullWidth name="clientId" as={TextField} label="Client ID" variant="outlined" />
                <ErrorMessage name="clientId" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="startDate"
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <ErrorMessage name="startDate" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="endDate"
                  label="End Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <ErrorMessage name="endDate" component="div" className="error" style={{ color: 'red' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field fullWidth as={TextField} name="modifiedPackagePrice" label="Modified Package Price" variant="outlined" />
                <ErrorMessage name="modifiedPackagePrice" style={{ color: 'red' }} component="div" className="error" />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h3" style={{marginTop:"10px"}}>Booking Details</Typography>
                <FieldArray name="bookingDetails">
                  {({ push, remove }) => (
                    <div>
                      {values?.bookingDetails.map((_, index) => (
                        <Paper key={index} elevation={3} style={{ padding: '10px', margin: '20px' }}>
                          <IconButton onClick={() => remove(index)} color="error" aria-label="delete">
                            <ClearIcon />
                          </IconButton>

                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Field
                                name={`bookingDetails.${index}.bookingType`}
                                as={TextField}
                                fullWidth
                                label="Booking Type"
                                variant="outlined"
                              />
                              <ErrorMessage
                                name={`bookingDetails.${index}.bookingType`}
                                component="div"
                                className="error"
                                style={{ color: 'red' }}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Field
                                name={`bookingDetails.${index}.bookingName`}
                                as={TextField}
                                fullWidth
                                label="Booking Name"
                                variant="outlined"
                              />
                              <ErrorMessage
                                name={`bookingDetails.${index}.bookingName`}
                                component="div"
                                className="error"
                                style={{ color: 'red' }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4} style={{ marginTop: '7px' }}>
                              <input
                                id={`docImg-${index}`}
                                type="file"
                                name={`bookingDetails[${index}].docImg`}
                                onChange={(e) => {
                                  setFieldValue(`bookingDetails[${index}].docImg`, e?.currentTarget?.files[0]);
                                  setFieldValue(`bookingDetails[${index}].docImgName`, e?.currentTarget?.files[0]?.name);
                                }}
                                accept="image/*"
                                style={{ display: 'none' }}
                              />
                              <FormLabel htmlFor={`docImg-${index}`}>
                                <Button variant="outlined" component="span" fullWidth style={{ textTransform: 'none' }}>
                                  Upload Document
                                </Button>
                              </FormLabel>
                              <div>
                                {values?.bookingDetails[index]?.docImgName && (
                                  <p style={{ margin: '0', paddingTop: '8px' }}>
                                    Selected Document: {values?.bookingDetails[index]?.docImgName}
                                  </p>
                                )}
                              </div>
                              <ErrorMessage
                                name={`bookingDetails.${index}.docImg`}
                                component="div"
                                className="error"
                                style={{ color: 'red' }}
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                      <Button type="button" onClick={() => push({ bookingType: '', bookingName: '', docImg: '' })}>
                        Add Booking Detail
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      <Toaster />
    </Container>
  );
};

export default CreateBooking;
