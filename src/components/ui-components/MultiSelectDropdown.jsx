import React, { useState, useEffect } from "react";
import { Autocomplete, createFilterOptions } from "@mui/material";
import { TextField, Box, Typography, Checkbox } from "@mui/material";
import { styled } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ReportStruct from "../Reports/Content/ReportStruct";
import { useSelector, useDispatch } from 'react-redux';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: '#00AD6F' }} />;
const checkedIcon = <CheckBoxIcon fontSize="small" sx={{ color: '#00AD6F' }} />;

const AutoCompleteComponent = styled(Autocomplete)((props) => ({
  "& .MuiInputBase-root": {
    marginTop: '8px',
    maxWidth: '397px',
    maxHeight: '56px',
    border: props.disabled ? '1px solid rgba(0, 0, 0, 0.1) !important' : '1px solid rgba(0, 0, 0, 0.23) !important'
  },
  "& .MuiButtonBase-root": {
    "&.MuiAutocomplete-popupIndicator": {
      transform: 'rotate(0) !important'
    }
  },
  "& .MuiOutlinedInput-root.MuiInputBase-root": {
    // maxHeight: '100px',
    overflowX: 'auto'
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: 'none !important',
    maxHeight: '100px'
  },
  "& .MuiOutlinedInput-root.MuiInputBase-root": {
    maxHeight: '100px',
    overflowX: 'auto'
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: 'none !important'
  }
}))

const MultiSelectDropdown = (props) => {
  const [selectedItem, setSelectedItem] = useState([]);
  const limitTags = 1;
  // const allSelected = ( (props.options.length + 1 ) === selectedItem.length );
  const allSelected = ((props.options?.length) === selectedItem?.length);

  const dispatch = useDispatch();

  const route = useSelector((state) => state.route);

  const onSelectAll = isSelected => {
    if (isSelected) {
      setSelectedItem([...props.options]);
    } else {
      handleClearOptions();
    }
  };

  const getName = (option) => {
    return ({
      'supplier': option?.supplier_name,
      'manufacturer': option?.manufacturer_name,
      'category': option?.category_name,
      'clinic': option?.clinic_name,
    }[props.tag])
  }

  const getObject = () => {
    return ({
      'supplier': { supplier_name: 'All', supplier_key: '*' },
      'manufacturer': { manufacturer_name: 'All', manufacturer_key: '*' },
      'category': { category_key: '', category_name: 'All' },
      'clinic': { location_id: '', clinic_name: "All" },
    }[props.tag])
  }

  React.useEffect(() => {
    setSelectedItem([...props.options]);
  }, [])

  React.useEffect(() => {
    // setSelectedItem([getObject(), ...props.options]);
    setSelectedItem([]);
  }, [route.activeItem])

  React.useEffect(() => {
    props.formikProps.setFieldValue(`filters[${props.tag}]`, props.allFlag ? new ReportStruct(true, []) : new ReportStruct(false, selectedItem));
  }, [selectedItem])

  // Reset filter data on toggle
  React.useEffect(() => {
    if (props.allFlag === true) {
        // reset selected items
        props.formikProps.setFieldValue(`filters[${props.tag}]`, new ReportStruct(true, []))
        setSelectedItem([]);
    } else {
        props.formikProps.setFieldValue(`filters[${props.tag}]`, new ReportStruct(false, selectedItem))
    }
  }, [props.allFlag])

  const handleClearOptions = () => setSelectedItem([]);

  const handleChange = (event, selectedOptions, reason) => {
    if (reason === "selectOption" || reason === "removeOption") {
      if (selectedOptions.find(option => getName(option) === "All")) {
        onSelectAll(!allSelected);
      } else {
        setSelectedItem(selectedOptions);
      }
    } else if (reason === "clear") {
      handleClearOptions();
    }
  };

  const filter = createFilterOptions();
  const filterOptions = (options, params) => {
    const filtered = filter(options, params);
    return [...filtered];
  }

  const optionRenderer = (props, option, { selected }) => {
    const selectAllProps =
      getName(option) === "All" // To control the state of 'select-all' checkbox
        ? { checked: allSelected }
        : { checked: selected };
    return (
      <li {...props} key={props.id}>
        <Checkbox
          color="primary"
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          {...selectAllProps}
        />
        {getName(option)}
      </li>
    );
  };

  return (
    <>
      <AutoCompleteComponent
        disabled={props.allFlag}
        multiple
        id="checboxes"
        options={props?.options}
        limitTags={limitTags}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        onChange={handleChange}
        // popupIcon={<> <Typography variant="formText" >Select</Typography>
        //   <KeyboardArrowDownIcon color='smallGreen' /></>}
        popupIcon=""
        getOptionLabel={(option) => getName(option)}
        disableCloseOnSelect
        isOptionEqualToValue={(option, value) => {
          return {
            'supplier': option.supplier_key === value.supplier_key,
            'manufacturer': option.manufacturer_key === value.manufacturer_key,
            'category': option.category_key === value.category_key,
            'clinic': option.location_id === value.location_id,
          }[props.tag]
        }}
        value={selectedItem}
        renderOption={optionRenderer}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField 
            {...params} 
            style={{ fontSize: '12px' }}
            placeholder={selectedItem?.length === 0 && !props.allFlag ? `Search ${props.tag} ...` : selectedItem?.length === 0 && props.allFlag ? `All ${props.tag} selected` : ''}
          />
        )}
      />
    </>
  )
}

export default MultiSelectDropdown;