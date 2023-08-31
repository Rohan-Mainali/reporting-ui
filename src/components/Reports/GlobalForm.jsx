import React, { cloneElement, useState  } from "react";
import { Formik} from "formik";
import { useDispatch, useSelector } from "react-redux";
import { postReport } from '../../redux/slices/routeSlice';
import moment from 'moment';
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material"

const GlobalForm = (props) => {
    const route = useSelector((state) => state.route);
    const form = useSelector((state) => state.form);
    const [formValid,setFormValid] = useState(false);
    const dispatch = useDispatch();
    const renderClonedChildren = (formikProps) => {
        if(props.children){
            if (Object.keys(props.children)[0] === '0') {
                // Multiple Children
                return props.children.map((el, index) => cloneElement(el, { key: index, formikProps: formikProps }))
            } else {
                // Single Children
                return cloneElement(props.children, { formikProps: formikProps })
            }
        }
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setFormValid(false);
      }
    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    const validate = (values ,setErrors) => {
        let formErrors = {};

        if(values.title === "") {
            formErrors['title'] = "This field cannot be empty";
        }

        if(values.email.length > 0) {
            let emails = values.email;
            let validations = false;
            if( emails.length > 0 ) {
                emails.forEach((v) => {
                    validations = validateEmail(v)
                })
            }
            if ( !validations ) {
                formErrors['email'] = "Enter valid email";
            }
        }
        route.activeItem.filters.forEach((v,i) => {

            if (v.type === "clinic") {
                if(!values.filters.clinic.all && values.filters.clinic.selected.length <=0 ) {
                    formErrors['clinic'] = "This field cannot be empty";
                }
            } else if (v.type === "supplier") {
                if(!values.filters.suppliers.all && values.filters.suppliers.selected.length <=0 ) {
                    formErrors['suppliers'] = "This field cannot be empty";
                }
            } else if (v.type === "category") {
                if(!values.filters.category.all && values.filters.category.selected.length <=0 ) {
                    formErrors['category'] = "This field cannot be empty";
                }
            } else if (v.type === "manufacturer") {
                if(!values.filters.manufacturers.all && values.filters.manufacturers.selected.length <=0 ) {
                    formErrors['manufacturers'] = "This field cannot be empty";
                }
            }

        })
        if ( values.date_range.range_date_start === "" || values.date_range.range_date_start === null ||
            values.date_range.range_date_end === "" || values.date_range.range_date_end === null || moment(values.date_range.range_date_start).isAfter(values.date_range.range_date_end)) {
            formErrors['date_range'] = "Select a valid date range";
        } 

        // if( values.email === "") {
        //     formErrors['email'] = "Enter an email";
        // }
        //
        if ( values.projection_fields.selected.length <= 0) {
            formErrors['projection_fields'] = "Select at least one field";
        } 

        if ( values.date_range_option === "") {
            formErrors['date_range_option'] = "Select a Date range";
        } 
 
        if (Object.keys(formErrors).length > 0) { setErrors(formErrors); setFormValid(true); }
        return (Object.keys(formErrors).length <= 0);
    }

    return (
        <div>
            <Formik
                initialValues={{ ...props.initialValues }}
                onSubmit={(values, {setErrors}) => {
                    const payload = {classification: route.activeItem.title, 
                                     user_id: (form.userID !== null) ? form.userID : "",
                                     desc: route.activeItem.desc,
                                     report_view: route.activeItem.reportView,
                                     report_status: 'REQUESTED',
                                     last_delivered_date: null,
                                    //  first_delivery_date: moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString(),
                                     next_delivery_date: null,
                                     group_id: ( route.user.group_id) ? route.user.group_id : '',
                                     group_service_id: ( route.user.group_service_id) ? route.user.group_service_id : '',
                                     parent_report_id: '',
                                     schedule_frequency: values.scheduleFrequency.label,
                                     ...values, 
                                     timestamp: moment().toISOString(),
                                     projection_fields: {...values.projection_fields,
                                        selected: route.activeItem?.fields?.filter( f=>
                                          values.projection_fields.selected.find(ff => ff.key === f.key)
                                        ).map((field) =>  { return { key: field.key, value: field.value} }  ) }

                    }
                    delete payload.checkSearch;
                    delete payload.scheduleFrequency;
                    validate(values,setErrors) && dispatch(postReport(payload))
                }}
            >
                {(props) => ( 
                    <form onSubmit={props.handleSubmit}>
                        {
                            renderClonedChildren(props)
                        }
                    </form>
                )}
            </Formik>
            <Snackbar open={formValid} anchorOrigin={{vertical: 'top',horizontal:'right'}} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Please fill the form with valid data.
                </Alert>
            </Snackbar>
            { (route.loading) && <Box sx={{width:"100%",zIndex:'3', position:'absolute', top: '0', left: '0', filter:'blur(20)',background:'rgba(0,0,0,.2)',height: '100vh', display:'flex', alignItems:'center', justifyContent: 'center'}}><CircularProgress size="5rem" color="success" /></Box>}
        </div>
    );
}

export default GlobalForm;
