import GlobalForm from "../GlobalForm";
import React, { useState } from 'react';
import EmailBox from "../../ui-components/EmailBox";
import InputBox from "../../ui-components/InputBox";
import SelectDropdown from "../../ui-components/SelectDropdown";
import DatePickerRange from "../../ui-components/DatePickerRange";
import CustomSearchInputBox from "../../ui-components/CustomSearchInputBox";
import CustomCheckBox from "../../ui-components/CustomCheckBox";
import { Box, Typography, Alert, RadioGroup, FormControl, FormControlLabel, styled, Radio, InputBase, Switch } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import DatePickerSingle from "../../ui-components/DatePickerSingle";
import { Button } from "@mui/material";
import MultiSelectDropdown from "../../ui-components/MultiSelectDropdown";
import CustomMultiSelectDrop from "../../ui-components/CustomMultiSelectDrop";
import ReportStruct from "./ReportStruct";
import { recordDateArray } from "../../../redux/slices/routeSlice";
import ErrorMsg from "./ErrorMsg";
import moment from "moment";
import Filter from '../../Filter/Filter'

const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  minWidth: '311px',
  margin: '0 0 4px 0',
  height: '40px',
  background: '#FAFAFA',
  border: '0.5px solid #CCCCCC',
  borderRadius: '2px',

  '& .MuiRadio-root.Mui-checked' : {
    color: "#2e7d32"
  }
}))

export default function ReportContent() {
  const route = useSelector((state) => state.route)
  let set = new Date();
  let localISOTime = set.getFullYear() + '-' + ( set.getMonth() + 1) + '-' + set.getDate();
  return (
    <GlobalForm
      initialValues={{
        date_range_option: "",
        date_range: { range_date_start: null, range_date_end: null },
        checkSearch: "",
        projection_fields: new ReportStruct(true, []),
        filters: {
          suppliers: new ReportStruct(true, []),
          manufacturers: new ReportStruct(true, []),
          category: new ReportStruct(true, []),
          clinic: new ReportStruct(true, []),
          serviceEquipments: { include: false },
          offCatalogOnly: { include: false },
        },
        custom_field_filters:{
          operation:'',
          condition:[],
        },
        report_format: 'csv',
        email: [],
        scheduleFrequency: {},
        report_type: route.modalShow.report_type,
        //first_delivery_date: moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString(),
        first_delivery_date: localISOTime, 
        title: ''
        // frequencyOption: [],
        // scheduleStartingDate: null
      }}
    >
      <Form />
    </GlobalForm>
  );
}

const Form = (props) => {
  const route = useSelector((state) => state.route)
  const form = useSelector((state) => state.form)
  const dispatch = useDispatch();
  const reportType = route.modalShow.report_type;
  const [scheduleValue, setScheduleValue] = useState(reportType);
  const [dateArray, setDateArray] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  let item = route.activeItem;
  const dateArr = item.filters.filter(item => (item.type === "date_range"))
  const [allSupplierFlag, setAllSupplierFlag] = useState(true);
  const [allManufacturerFlag, setAllManufacturerFlag] = useState(true);
  const [allClinicFlag, setAllClinicFlag] = useState(true);
  const [allCategoryFlag, setAllCategoryFlag] = useState(true);
  const [allEquipmentFlag,setAllEquipmentFlag] = useState(false);
  const [offCatalogOnlyFlag,setOffCatalogOnlyFlag] = useState(false);
  const [reportFormatFlag,setReportFormatFlag] = useState('csv');
  const FrequencyOptions = [
    {
      key: 1,
      value: 'Daily',
      label: 'DAILY'
    },
    {
      key: 7,
      value: 'Weekly',
      label: 'WEEKLY'
    },
    {
      key: 14,
      value: 'Bi-Weekly',
      label: 'BIWEEKLY'
    },
    {
      key: 30,
      value: 'Monthly',
      label: 'MONTHLY'
    },
    {
      key: 91,
      value: 'Quarterly',
      label: 'QUARTERLY'
    },
    {
      key: 182,
      value: 'Semi-Annually',
      label: 'SEMI-ANNUALLY'
    },
    {
      key: 365,
      value: 'Annually',
      label: 'ANNUALLY'
    }
  ]

  const handleChange = (event) => {
    setScheduleValue(event.target.value);
    props.formikProps.setFieldValue('report_type', event.target.value);
  };

  React.useEffect(() => {
      const projection_fields =  props.formikProps.values["projection_fields"]; 
      projection_fields.selected = filterItems;
      projection_fields.all = ( item.fields.length === filterItems.length )
  }, [filterItems])

  const setRange = (data) => {
    let start = null, end = null;
    start = moment().subtract(Number(data?.key) + 1, 'd').utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString();
    if (start != null) {
      end = moment().subtract(1, 'd').utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString();
      props.formikProps.setFieldValue('date_range', {
        range_date_start: start, range_date_end: end
      })
    }
  }

  // Resetting form data on reroute
  React.useEffect(() => {
    setFilterItems(route.activeItem?.fields?.filter((field) => !field?.unselected));
    props.formikProps.values["projection_fields"].selected = filterItems;
    const dateRange = route.activeItem.filters.filter((i) => i.type === "date_range")
    props.formikProps.values["date_range_option"] = dateRange[0].values[dateRange[0].default];
    props.formikProps.values["custom_field_filters"] = {
      operation:'',
      condition:[],
    };
    setRange(dateRange[0].values[dateRange[0].default])
    // props.formikProps.values['filters'] = {
    //   suppliers: new ReportStruct(true, []),
    //   manufacturers: new ReportStruct(true, []),
    //   category: new ReportStruct(true, []),
    //   clinic: new ReportStruct(true, [])
    // }

    // Resetting filter values
    props.formikProps.setFieldValue('filters', {
      suppliers: new ReportStruct(true, []),
      manufacturers: new ReportStruct(true, []),
      category: new ReportStruct(true, []),
      clinic: new ReportStruct(true, []),
	    serviceEquipments: { include: false},
      offCatalogOnly: { include: false},
    })
    props.formikProps.values['email'] = [];
    // schedule_frequency: ''
    props.formikProps.values['report_type'] = reportType;
    setScheduleValue(reportType);
    // Resetting switch toggle form value
    setAllCategoryFlag(true);
    setAllClinicFlag(true);
    setAllManufacturerFlag(true);
    setAllSupplierFlag(true);
    
  }, [route.activeItem])


  const handleFilterChange = (selectedConditions,selectedOperation) => {
    const conditions = []
    for (const selectedCondition of selectedConditions) {
      if (selectedCondition.fieldId !== " " && selectedCondition.operator !== " ") {
        conditions.push(selectedCondition)
      }
    }
    props.formikProps.setFieldValue('custom_field_filters',{condition:conditions, operation:selectedOperation})
  };

  React.useEffect(() => {
    if (dateArr.length === 1) {
        var arr_v = [];
        arr_v.push(...dateArr[0].values);
        arr_v.push({ key: -2, value: 'Month To Date'})
        arr_v.push({ key: -4, value: 'Previous Calendar Month'})
        arr_v.push({ key: -3, value: 'Year To Date'})
        if( scheduleValue === 'AD_HOC') {
          arr_v.push({ key: -1, value: 'Custom Range' })
        }
        dispatch(recordDateArray(arr_v));
    }
  }, [scheduleValue])
  

  //   React.useEffect(() => {
  //   if (dateArr.length === 1) {
  //     if (scheduleValue == 0) {
  //       let arr_v = Object.assign([], dateArr[0].values);
  //       arr_v.push({ key: 'custom_range', value: 'Custom Range' })
  //       dispatch(recordDateArray(arr_v));
  //     } else {
  //       dispatch(recordDateArray(dateArr[0].values));
  //     }
  //   }
  // }, [scheduleValue])

  const toggleAllSelectionSwitch = (tag) => {
    switch (tag){
      case 'suppliers':
        setAllSupplierFlag(!allSupplierFlag);
        break;
      case 'manufacturers':
        setAllManufacturerFlag(!allManufacturerFlag);
        break;
      case 'clinic':
        setAllClinicFlag(!allClinicFlag);
        break;
      case 'category':
        setAllCategoryFlag(!allCategoryFlag);
        break;
      case 'serviceEquipments': {
        setAllEquipmentFlag(!allEquipmentFlag);
        props?.formikProps.setFieldValue('filters[serviceEquipments]',{ include: !allEquipmentFlag })
      }
      break;
      case 'reportFormat':
        if (reportFormatFlag === 'xlsx') {
            setReportFormatFlag('csv');
            props?.formikProps.setFieldValue('report_format', 'csv')
        } else {
            setReportFormatFlag('xlsx');
            props?.formikProps.setFieldValue('report_format', 'xlsx')
        }
        break;
      case 'offCatalogOnly': {
        setOffCatalogOnlyFlag(!offCatalogOnlyFlag);
        props?.formikProps.setFieldValue('filters[offCatalogOnly]',{ include: !offCatalogOnlyFlag })
      }
      break;
      default:
        break;
    }
  }

  return (
    <Box sx={{maxHeight: '70vh',height: '100%',overflowY: 'auto', overflowX: 'hidden'}}>
      <Box sx={{
        padding: '12px 16px 0 32px',
        borderRadius: '0',
        background: '#fff'
      }}>
        <Box sx={{ mt: '40px' }}>
          <Typography variant="reportDisplayRoboto" component="div" >{item?.title}</Typography>
          <Typography variant="reportTitleTextRoboto" component="div" sx={{ mt: '8px' }}>{item?.desc}</Typography>
        </Box>
            <Box sx={{}}>
              <Typography variant="reportTitle" component="div" >Report Name</Typography>
        <InputBox
          sx={{ width: '397px' }}
          tag={"title"}
          formikProps={props?.formikProps}
          label={"Report Name"}
        />
        <ErrorMsg formikProps={props.formikProps} tag={"title"} />
        </Box>

        <Box sx={{display: 'flex', alignItems: 'baseline'}}>
          <Typography variant="reportTitle">Report Format</Typography>
          <FormControl sx={{paddingLeft: '10px', background: '#ededed', marginLeft: '10px', borderRadius: '20px'}}>
            <RadioGroup
                row
                defaultValue="csv"
                name="report-format-radio-buttons-group"
            >
              <FormControlLabel value="csv" control={<Radio checked={reportFormatFlag === "csv"}
                                                            onChange={() => toggleAllSelectionSwitch('reportFormat')}
                                                            color="success"/>} label={<Typography style={{fontSize: '14px', fontWeight: '500'}}>CSV</Typography>}  />
              <FormControlLabel value="xlsx" control={<Radio checked={reportFormatFlag === "xlsx"}
                                                             onChange={() => toggleAllSelectionSwitch('reportFormat')}
                                                             color="success"/>} label={<Typography style={{fontSize: '14px', fontWeight: '500'}}>XLSX</Typography>} />
            </RadioGroup>
          </FormControl>
        </Box>


        {item?.filters && item.filters.map((v, filter_index) => {
          var fields = [];

          // CLINIC
          if (v.type === "clinic") {
            fields.push(<div key={filter_index}>
                                          <Box sx={{display: 'flex', alignItems: 'baseline'}}>

              <Typography variant="reportTitle" component="div" >For Office / Location</Typography>

              <FormControl sx={{paddingLeft: '10px', background: '#ededed', marginLeft: '10px', borderRadius: '20px'}}>
                <FormControlLabel
                  control={
                    <Switch checked={allClinicFlag} onChange={() => toggleAllSelectionSwitch('clinic')} name="allSupplier" color="success" />
                  }
                  label={<Typography style={{ fontSize: '14px', fontWeight: '500' }}>All</Typography>}
                />
              </FormControl>
              </Box>
              <MultiSelectDropdown allFlag={allClinicFlag} tag={"clinic"} formikProps={props?.formikProps} options={form.clinic} />
              <ErrorMsg formikProps={props.formikProps} tag={"clinic"} />
            </div>)
          }

          // Service/Equipment
          if (v.type === "serviceEquipments") {
            fields.push(<div key={filter_index}>
                                          <Box sx={{display: 'flex', alignItems: 'baseline'}}>

              <Typography variant="reportTitle" component="div" >Include Service / Equipments order:</Typography>

              <FormControl sx={{paddingLeft: '10px', background: '#ededed', marginLeft: '10px', borderRadius: '20px'}}>
                <FormControlLabel
                  control={
                    <Switch checked={props?.formikProps.values['serviceEquipments']} onChange={() => toggleAllSelectionSwitch('serviceEquipments')} name="allServiceEquipment" color="success" />
                  }
                />
              </FormControl>
              </Box>
              <ErrorMsg formikProps={props.formikProps} tag={"serviceEquipments"} />
            </div>)
          }

          // off-catalog-only
          if (v.type === "offCatalogOnly") {
            fields.push(<div key={filter_index}>
              <Box sx={{display: 'flex', alignItems: 'baseline'}}>

                <Typography variant="reportTitle" component="div" >Include Off-Catalog Items Only:</Typography>

                <FormControl sx={{paddingLeft: '10px', background: '#ededed', marginLeft: '10px', borderRadius: '20px'}}>
                  <FormControlLabel
                    control={
                      <Switch checked={props?.formikProps.values['offCatalogOnly']} onChange={() => toggleAllSelectionSwitch('offCatalogOnly')} name="offCatalogOnly" color="success" />
                    }
                  />
                </FormControl>
              </Box>
              <ErrorMsg formikProps={props.formikProps} tag={"offCatalogOnly"} />
            </div>)
          }

          // SUPPLIER 
          if (v.type === "supplier") {
            //   if (v.type === "suppliers" && form.suppliers.length > 0) {
            fields.push(<div key={filter_index}>
                                          <Box sx={{display: 'flex', alignItems: 'baseline'}}>

              <Typography variant="reportTitle" component="div" >Select Suppliers to include</Typography>

              <FormControl sx={{paddingLeft: '10px', background: '#ededed', marginLeft: '10px', borderRadius: '20px'}}>
                <FormControlLabel
                  control={
                    <Switch checked={allSupplierFlag} onChange={() => toggleAllSelectionSwitch('suppliers')} name="allSupplier" color="success" />
                  }
                  label={<Typography style={{ fontSize: '14px', fontWeight: '500' }}>All</Typography>}
                />
              </FormControl>
              </Box>
              <CustomMultiSelectDrop allFlag={allSupplierFlag} tag={"suppliers"} formikProps={props?.formikProps} options={form.supplier} />
              <ErrorMsg formikProps={props.formikProps} tag={"suppliers"} />
            </div>)
          }

          // CATEGORY
          if (v.type === "category") {
            //   if (v.type === "category" && form.category.length > 0) {
            fields.push(<div key={filter_index}>
                            <Box sx={{display: 'flex', alignItems: 'baseline'}}>

              <Typography variant="reportTitle" component="div" >Select Categories to include</Typography>
              <FormControl sx={{paddingLeft: '10px', background: '#ededed', marginLeft: '10px', borderRadius: '20px'}}>
                <FormControlLabel
                  control={
                    <Switch checked={allCategoryFlag} onChange={() => toggleAllSelectionSwitch('category')} name="allSupplier" color="success" />
                  }
                  label={<Typography style={{ fontSize: '14px', fontWeight: '500' }}>All</Typography>}
                />
              </FormControl>
              </Box>
              <MultiSelectDropdown allFlag={allCategoryFlag} tag={"category"} formikProps={props?.formikProps} options={form.category} />
              <ErrorMsg formikProps={props.formikProps} tag={"category"} />
            </div>)
          }

          // MANUFACTURER
          if (v.type === "manufacturer") {
            //   if (v.type === "manufacturers" && form.manufacturers.length > 0) {
            fields.push(<div key={filter_index}>
              <Box sx={{display: 'flex', alignItems: 'baseline'}}>
              <Typography variant="reportTitle" component="div" >Select Manufacturers to include</Typography>
              <FormControl sx={{paddingLeft: '10px', background: '#ededed', marginLeft: '10px', borderRadius: '20px'}}>
                <FormControlLabel
                  control={
                    <Switch checked={allManufacturerFlag} onChange={() => toggleAllSelectionSwitch('manufacturers')} name="allManufacturer" color="success" />
                  }
                  label={<Typography style={{ fontSize: '14px', fontWeight: '500' }}>All</Typography>}
                />
              </FormControl>
              </Box>
              <CustomMultiSelectDrop allFlag={allManufacturerFlag} tag={"manufacturers"} formikProps={props?.formikProps} options={form.manufacturer} />

              <ErrorMsg formikProps={props.formikProps} tag={"manufacturers"} />
            </div>)
          }

          // DATE RANGE
          if (v.type === "date_range") {
            fields.push(<div key={filter_index}>
              <Typography variant="reportTitle" component="div" >Select Date Range</Typography>

              <SelectDropdown
                tag={"date_range_option"}
                formikProps={props?.formikProps}
                placeholder={"Select Date Range"}
                width={"248px"}
                fromSlice={true}
                default={v.default}
              />
              <ErrorMsg formikProps={props.formikProps} tag={"date_range_option"} />

              {(props.formikProps.values.date_range_option?.value === "Custom Range") ? (
                <><DatePickerRange
                  tag={["range_date_start", "range_date_end"]}
                  formikProps={props?.formikProps}
                  label={["Start Date", "End Date"]}
                />
                  <ErrorMsg formikProps={props.formikProps} tag={"date_range"} />
                </>
              ) : ''}

            </div>)
          }
          return fields;
        })}

        {(item?.fields) ? (<>
          <Typography variant="reportTitle" component="div" >Select the data you’d like in the report</Typography>
          <CustomSearchInputBox
            tag={"checkSearch"}
            formikProps={props?.formikProps}
            placeholder={"Search"}
            debounced
          />
          <ErrorMsg formikProps={props.formikProps} tag={"projection_fields"} />
          <Box
            sx={{ maxWidth: '300px', width: '100%', display: 'table', clear: 'both' }}>
            {
              item.fields
                .filter((el) =>
                  el.value
                    .toLowerCase()
                    .startsWith(props.formikProps.values['checkSearch'].toLowerCase())
                )
                .map((el, index) => {
                  return (
                    <Box key={index + item.title} sx={{ width: '50%', float: 'left' }}>
                      <CustomCheckBox
                        sx={{ width: '50%', float: 'left' }}
                        label={el.value}
                        key={index + item.title}
                        onCheck={() =>
                          setFilterItems(filterItems => [...filterItems, el])
                        }
                        onUncheck={() => {
                          setFilterItems(filterItems => filterItems.filter((el1) => el1.value !== el.value))
                        }}
                        isChecked={(el.unselected) ? false : true}
                        disabled={(el.required) ? true : false}
                        value={el.value}
                      />
                    </Box>)
                })}
            {/* {
                populateFilteredComponent(
                  item?.fields,
                  "checkSearch",
                  "projection_fields"
                )
              } */}
            </Box></>) : ''}
            <Box>
              <Filter data={route.activeItem}
                      onFilterChange={handleFilterChange}
                />
            </Box>
            <Typography variant="reportDisplayRoboto" component="div" sx={{marginTop:'48px'}} >When & How do you want your report?</Typography>
            <Typography variant="paragraphGrey" component="div" sx={{ mt: '8px',mb:'24px', maxWidth:'480px' }}>Once you select an option, we’ll work on the report and deliver it to your email address based on the option you selected
            </Typography>
            <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="report_type"
              id="report_type"
              value={scheduleValue}
              onChange={handleChange}
            >
              <StyledFormControlLabel value="AD_HOC" control={<Radio />} label="As soon as possible" />
              <StyledFormControlLabel value="SCHEDULED" control={<Radio />} label="Schedule to be delivered periodically" />
            </RadioGroup>
          </FormControl>
          { (scheduleValue === 'SCHEDULED' ) && <Box sx={{ background: '#2e7d3230', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', borderRadius: '10px', maxWidth: '311px', boxSizing:'border-box', marginTop: '10px' }}>
            <Box>
            <Typography variant="reportTitle" component="div" sx={{ marginTop: 0, width: '100%'}}>Select Reporting Frequency</Typography>
            <SelectDropdown
                  tag={"scheduleFrequency"}
                  formikProps={props?.formikProps}
                  placeholder={"Select Reporting Frequency"}
                  width={"248px"}
                  options={FrequencyOptions}
                  default={FrequencyOptions[0]}
                /></Box>
            <Box>
              <Typography variant="reportTitle" component="div" sx={{ marginTop: '10px !important', width: '100%'}}>First Delievery Date</Typography>

                <DatePickerSingle
                  tag={"first_delivery_date"}
                  formikProps={props?.formikProps}
                  label={"Start Date"}
                  sx={{ marginBottom : 0}}
                /></Box>
                </Box>
          }
          {/* {
            (show) ? (<><Typography variant="reportTitle" component="div" >Select Reporting Frequency</Typography>
            <SelectDropdown
                  tag={"frequencyOption"}
                  formikProps={props?.formikProps}
                  placeholder={"Select Reporting Frequency"}
                  width={"248px"}
                  options={FrequencyOptions}
                  default={FrequencyOptions[0]}
                /></>) : ''
          } */}

        <Typography variant="reportTitle" component="div" >A link to download the Report will be mailed to</Typography>
        <Typography variant="reportTitleText" component="div" sx={{ mt: '8px' }}>Email address on file</Typography>

        <EmailBox
          sx={{ width: '397px' }}
          tag={"email"}
          formikProps={props?.formikProps}
          label={"Email"}
        />
        <ErrorMsg formikProps={props.formikProps} tag={"email"} />

        <Typography variant="paragraphGrey" component="div" sx={{ mt: '8px', maxWidth: '320px' }}> To send report to multiple email addresses, add them separated by a comma(,).</Typography>
        {/* Checkbox filter */}

        {/* 
      <CustomSearchInputBox
        tag={"listSearch"}
        formikProps={props?.formikProps}
        placeholder={"Search Menu List"}
        // debounced
      />
      {populateFilteredComponent(COMPONENT_TYPE[1], listOption, "listSearch")} */}
        <Button label={"Submit Report"} type='submit' variant="contained" disableElevation color="success" sx={{ background: '#00AD6F', p: '20px 137px', marginTop: '48px', textTransform: 'none' }}>
          Generate Report
        </Button>
        {/* <MuiButtons label={"Submit Report"} /> */}
      </Box>
    </Box>
  );
};
