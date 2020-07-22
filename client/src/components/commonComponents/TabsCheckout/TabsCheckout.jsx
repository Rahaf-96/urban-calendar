import React, { useState, Fragment } from 'react';
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
  TextareaAutosize,
} from '@material-ui/core';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { Formik, Form } from 'formik';
import axios from 'axios';
import validationSchema from './FormModel/validationSchema';
import checkoutFormModel from './FormModel/checkoutFormModel';
import formInitialValues from './FormModel/formInitialValues';
import ContactInfo from '../../layouts/ContactInfo';
import BeforeVisit from '../../layouts/BeforeVisit';
import Booking from '../../layouts/Booking';
import Confirmation from '../../layouts/ConfirmationTab';
import Copyright from '../Footer';
import useStyles from './style';
import { result } from 'lodash';

const steps = ['Contact Info', 'Questions', 'Book'];
const { formId, formField } = checkoutFormModel;

const renderStepContent = (step, covidAnswer) => {
  switch (step) {
    case 0:
      return <ContactInfo formField={formField} />;
    case 1:
      return <BeforeVisit formField={formField} />;
    case 2:
      return <Booking formField={formField} covidAnswer={covidAnswer} />;
    default:
      throw new Error('Unknown tab');
  }
};

const TabsCheckout = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [covidAnswer, setCovidAnswer] = useState('no');
  const currentValidationSchema = validationSchema[activeStep];

  const isLastStep = activeStep === steps.length - 1;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const submitForm = async (values, actions) => {
    await sleep(1000);
    const { fullName, phone, email, zipCode, reservationTime } = values;
    const dateInfo = reservationTime.split('@');

    const swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: true,
    });

    swalWithBootstrapButtons
      .fire({
        imageUrl:
          'https://www.southislandmsa.ca/wp-content/uploads/2018/03/calendar-flat-icon-01-.jpg',
        imageHeight: 100,
        imageWidth: 150,
        imageAlt: 'A tall image',
        title: 'Are you sure?',
        text: `Your Appointment will be on ${
          dateInfo[1]
        } at ${dateInfo[2].slice(0, 5)}`,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#90B27A',
        cancelButtonColor: '#FF7171',
        reverseButtons: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      })
      .then((result) => {
        if (result.value) {
          const customerInfo = {
            fullName,
            phone,
            email,
            zipCode,
            reservationDate: dateInfo[1],
            timeId: dateInfo[0],
            reservationTime: dateInfo[2],
          };
          // the response will be used to setState for the confirmation alert later.
          axios
            .post('/api/questions/user-info', customerInfo)
            .then((res) => res.data)
            .catch((err) => err.response.data.message);

          actions.setSubmitting(false);
          setActiveStep(activeStep + 1);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          actions.setSubmitting(false);
          setActiveStep(activeStep);
        }
      });
  };

  const handleSubmit = (values, actions) => {
    if (isLastStep) {
      submitForm(values, actions);
    } else if (activeStep === 1) {
      setCovidAnswer(values.covid19);
      if (values.covid19 === 'yes') {
        Swal.fire({
          title: 'Bless you',
          text:
            'Your reservation will be postponed for 2 weeks from now due to your health situation. Thank you for your understanding',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
          imageUrl:
            ' https://cdn.dribbble.com/users/3691882/screenshots/11018522/media/0047aad1a6fb3aa4362d6acd69059924.gif',
          imageAlt: 'Custom image',
          confirmButtonText: 'I understand',
          showLoaderOnConfirm: true,
          confirmButtonColor: '#02C6C0',
          focusConfirm: true,
        }).then((res) => {
          if (res) {
            setActiveStep(activeStep + 1);
            actions.setTouched({});
            actions.setSubmitting(false);
          }
        });
      }
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper} elevation={10}>
          <Typography component="h1" variant="h4" align="center">
            Reservation
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Fragment>
            {activeStep === steps.length ? (
              <Confirmation />
            ) : (
              <Formik
                initialValues={formInitialValues}
                validationSchema={currentValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form id={formId}>
                    {renderStepContent(activeStep, covidAnswer)}

                    <div className={classes.buttons}>
                      {activeStep !== 0 && (
                        <Button onClick={handleBack} className={classes.button}>
                          Back
                        </Button>
                      )}
                      <div>
                        <Button
                          disabled={isSubmitting}
                          type="submit"
                          variant="contained"
                          color="primary"
                          className={classes.button}
                        >
                          {isLastStep ? 'Book Now!' : 'Next'}
                        </Button>
                        {isSubmitting && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )}
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </Fragment>
        </Paper>
        <Copyright />
      </main>
    </Fragment>
  );
};

export default TabsCheckout;
