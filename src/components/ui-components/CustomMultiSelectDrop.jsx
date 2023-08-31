import React, { useState, useEffect } from "react";
import { Autocomplete, createFilterOptions } from "@mui/material";
import { TextField, Box, CircularProgress, Typography, Checkbox } from "@mui/material";
import { styled } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ReportStruct from "../Reports/Content/ReportStruct";

import { useSelector, useDispatch } from 'react-redux'
import { fetchSupplier, fetchManufacturer, resetFilter } from "../../redux/slices/formSlice";

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
        maxHeight: '100px',
        overflowX: 'auto'
    },
    "& .MuiOutlinedInput-notchedOutline": {
        border: 'none !important'
    }
}))

const MultiSelectDropdown = ({ allFlag, tag, formikProps, options }) => {
    const [selectedItem, setSelectedItem] = useState([]);
    const limitTags = 1;
    // const allSelected = ( (options.length + 1 ) === selectedItem.length );
    const allSelected = ((options?.length) === selectedItem?.length);

    // Key map tag
    const [keyMap, setKeyMap] = useState('');
    const [apiFlag, setApiFlag] = useState(false);

    const dispatch = useDispatch();
    const route = useSelector((state) => state.route);

    const onSelectAll = isSelected => {
        if (isSelected) {
            setSelectedItem([...options]);
        } else {
            handleClearOptions();
        }
    };

    const getName = (option) => {
        return ({
            'suppliers': option?.supplier_name,
            'manufacturers': option?.manufacturer_name,
            'category': option?.category_name,
            'clinic': option?.clinic_name,
        }[tag])
    }

    const getObject = () => {
        return ({
            'supplier': { supplier_name: 'All', supplier_key: '*' },
            'manufacturer': { manufacturer_name: 'All', manufacturer_key: '*' },
            'category': { category_key: '', category_name: 'All' },
            'clinic': { location_id: '', clinic_name: "All" },
        }[tag])
    }

    React.useEffect(() => {
        setSelectedItem([...options]);
    }, [])

    React.useEffect(() => {
        setApiFlag(true);
    }, [options]);

    React.useEffect(() => {
        setSelectedItem([]);
    }, [route.activeItem])

    React.useEffect(() => {
        formikProps.setFieldValue(`filters[${tag}]`, allFlag ? new ReportStruct(true, []) : new ReportStruct(false, selectedItem));
    }, [selectedItem])

    // Reset filter data on toggle
    React.useEffect(() => {
        if (allFlag === true) {
            // reset selected items
            formikProps.setFieldValue(`filters[${tag}]`, new ReportStruct(true, []))
            setSelectedItem([]);
        } else {
            formikProps.setFieldValue(`filters[${tag}]`, new ReportStruct(false, selectedItem))
        }

    }, [allFlag])

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
        let filtered = filter(options, params);
        return [...filtered]
    }

    // Debounced search
    let timeOut = null;
    const handleDebouncedSearch = (key) => {
        // Update key map
        setKeyMap(key);

        // Update Api stat ( API Call initiated )
        setApiFlag(false);

        // console.log('Tag: ', e.target.value);
        window.clearTimeout(timeOut);
        
        if (key) {
            switch (tag) {
                case 'suppliers':
                    timeOut = setTimeout(() => {
                        dispatch(fetchSupplier(key));
                    }, 200)
                    break;
                case 'manufacturers':
                    timeOut = setTimeout(() => {
                        dispatch(fetchManufacturer(key));
                    }, 200)
                    break;
                default:
                    break;
            }
        }
    }

    const optionRenderer = (props, option, { selected }) => {
        const selectAllProps =
            getName(option) === "All" // To control the state of 'select-all' checkbox
                ? { checked: allSelected }
                : { checked: selected };

        if (options?.length > 0) {
            return (
                <li {...props} key={props.id}>
                    <Checkbox
                        color="primary"
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        // checked={selected}
                        {...selectAllProps}
                    // checked={true}
                    />
                    {getName(option)}
                </li>
            );
        } else {
            return (
                <i key={props.id} style={{ padding: '10px' }}>
                    Searching {tag} ...
                </i>
            )
        }

    };

    const renderLoading = () => {
        if((keyMap === '' || selectedItem.length === 0) && apiFlag === true){
            return (
                <React.Fragment>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography style={{
                            fontStyle: 'italic',
                            marginRight: '10px',
                            fontSize: '14px'
                        }}>
                            Search...
                        </Typography>
                    </Box>
                </React.Fragment>
            )
        } else if(keyMap !== '' && apiFlag === false){
            return (
                <React.Fragment>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography style={{
                            fontStyle: 'italic',
                            marginRight: '10px',
                            fontSize: '14px'
                        }}>
                            Loading
                        </Typography>
                        <CircularProgress color="success" size={20} />
                    </Box>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography style={{
                            fontStyle: 'italic',
                            marginRight: '10px',
                            fontSize: '14px'
                        }}>
                            No Data Found !
                        </Typography>
                    </Box>
                </React.Fragment> 
            )
        }
    }

    // React.useEffect(() => {
    //     console.log("OPTIONSSS :: ", options);
    //     console.log("TAG :: ", tag);
    //     console.log('SELECTED ITEM ::', selectedItem)
    // }, [options]);

    return (
        <>
            <AutoCompleteComponent
                disabled={allFlag}
                loading
                loadingText={renderLoading()}
                multiple
                id="checboxes"
                options={options}
                limitTags={limitTags}
                filterOptions={filterOptions}
                sx={{ width: 300 }}
                onChange={handleChange}
                getOptionLabel={(option) => getName(option)}
                disableCloseOnSelect
                isOptionEqualToValue={(option, value) => {
                    return {
                        'suppliers': option.supplier_key === value.supplier_key,
                        'manufacturers': option.manufacturer_key === value.manufacturer_key,
                        'category': option.category_key === value.category_key,
                        'clinic': option.location_id === value.location_id,
                    }[tag]
                }}
                freeSolo={true}
                clearOnBlur={true}
                clearOnEscape={true}
                onInputChange={(event, value, reason) => {
                    if(reason === 'input') {
                        handleDebouncedSearch(value);
                    }
                }}
                onClose={(event, reason) => {
                    // console.log('CLOSE EVENT :: ', event);
                    // console.log('CLOSE REASON :: ', reason);
                    if(reason === 'escape' || reason === 'blur'){
                        // RESET STORE VALUE
                        dispatch(resetFilter({
                            tag: tag.slice(0, -1),
                            value: []
                        }))

                        // Reset Keymap
                        setKeyMap('');
                    }
                }}
                value={selectedItem}
                renderOption={optionRenderer}
                style={{ width: 500 }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        style={{ fontSize: '12px' }}
                        placeholder={selectedItem?.length === 0 && !allFlag ? `Search ${tag} ...` : selectedItem?.length === 0 && allFlag ? `All ${tag} selected` : ''}
                    />
                )}
            />
        </>
    )
}

export default MultiSelectDropdown;