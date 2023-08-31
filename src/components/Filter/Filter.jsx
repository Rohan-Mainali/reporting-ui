import React, { useState } from "react";
import {Box, Button, InputBase, MenuItem, Select, TextField, Typography} from "@mui/material";
import { styled } from "@mui/material/styles";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
const Filter = ({ data, onFilterChange }) => {
  const Operator = {
    number: [
      {
        key: "=",
        value: "Equals To",
      },
      {
        key: "!=",
        value: "Not Equals To",
      },
      {
        key: "<",
        value: "Less Than",
      },
      {
        key: ">",
        value: "Greater Than",
      },
      {
        key: "<=",
        value: "Less Than Or Equals To",
      },
      {
        key: ">=",
        value: "Greater Than or Equals To",
      },
      {
        key: "Is Not Empty",
        value: "Is Not Empty",
      },
      {
        key: "Is Empty",
        value: "Is Empty",
      },
    ],
    text: [
      {
        key: "=",
        value: "Equals To",
      },
      {
        key: "!=",
        value: "Not Equals To",
      },
      {
        key: "Starts With",
        value: "Starts With",
      },
      {
        key: "Ends With",
        value: "Ends With",
      },
      {
        key: "Contains",
        value: "Contains",
      },
      {
        key: "Does Not Contain",
        value: "Does Not Contain",
      },
      {
        key: "Is Not Empty",
        value: "Is Not Empty",
      },
      {
        key: "Is Empty",
        value: "Is Empty",
      },
    ],
    date: [
      {
        key: "=",
        value: "Equals To",
      },
      {
        key: "!=",
        value: "Not Equals To",
      },
      {
        key: "<",
        value: "Is Before",
      },
      {
        key: ">",
        value: "Is After",
      },
    ],
  };

  const Operation = [
    { key: "AND", value: "AND" },
    { key: "OR", value: "OR" },
  ];

  const initialOptions = [{ fieldId: " ", operator: " ", value: null }];

  const [selectedOptions, setSelectedOptions] = useState(initialOptions);
  const [selectedValue, setSelectedValue] = useState(Operation[0].value);
  const [dateValue, setDateValue] = useState(null);

  const handleOperationChange = (event) => {
    setSelectedValue(event.target.value);
  };

  React.useEffect(() => {
    onFilterChange(selectedOptions, selectedValue);
  }, [selectedOptions, selectedValue]);

  const renderConditions = (dataFields, option) => {
    const field = dataFields.find(f => f.key === option.fieldId)
    if (!field || field?.type === "none") {
      return ("")
    }
    if (field.type === "date") {
      return Operator.date.map((operator) => (
        <MenuItem key={operator.key} value={operator.key}>
          {operator.value}
        </MenuItem>
      ));
    } else if (field.type === "number") {
      return Operator.number.map((operator) => (
        <MenuItem key={operator.key} value={operator.key}>
          {operator.value}
        </MenuItem>
      ));
    } else {
      return Operator.text.map((operator) => (
        <MenuItem key={operator.key} value={operator.key}>
          {operator.value}
        </MenuItem>
      ));
    }
  }

  const renderValueField = (dataFields, option, index) => {
    const field = dataFields.find(f => f.key === option.fieldId)

    if (!field || option.operator === "Is Empty" ||
      option.operator === "Is Not Empty" || option.operator === " ") {
      return ("")
    } else if (field.type === "date") {
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            keyboard={false}
            label="Select Date"
            value={dateValue}
            onChange={(newValue) => {
              let currentDate = moment(newValue).startOf('day').utc(true).format("YYYY-MM-DD");
              handleValueChange(index, currentDate);
              setDateValue(newValue)
            }}
            mask={"____-__-__"}
            inputFormat={"yyyy-mm-dd"}
            renderInput={({inputRef, inputProps, InputProps }) =>
              <InputBase
                helperText="Select Date"
                placeholder="Select Date"
                ref={inputRef}
                {...inputProps}
                endAdornment={(
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                    {InputProps?.endAdornment}
                  </div>
                )}
                value={option.value}
                variant="outlined"
                // onChange={(e) => handleValueChange(index, e.target.value)}
                style={{
                  width: "95%",
                  paddingLeft: "5px",
                  height: "40px",
                  border: ".5px solid #CCCCCC",
                  borderRadius: "1px",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  background: "#FAFAFA",
                  fontSize: "12px"
                }}
            />}
          />
        </LocalizationProvider>
      )
    } else if (field.type === "number") {
      return (
        <InputBase
          placeholder="Enter Number"
          type="number"
          value={option.value}
          variant="outlined"
          onChange={(e) => handleValueChange(index, e.target.value)}
          style={{
            width: "95%",
            paddingLeft: "5px",
            height: "40px",
            border: ".5px solid #CCCCCC",
            borderRadius: "1px",
            boxSizing: "border-box",
            cursor: "pointer",
            background: "#FAFAFA",
            fontSize: "12px"
          }}
        />
      )
    } else if (field.type === "text") {
      return (
        <InputBase
          placeholder="Enter Value"
          value={option.value}
          variant="outlined"
          onChange={(e) => handleValueChange(index, e.target.value)}
          style={{
            width: "95%",
            paddingLeft: "5px",
            height: "40px",
            border: ".5px solid #CCCCCC",
            borderRadius: "1px",
            boxSizing: "border-box",
            cursor: "pointer",
            background: "#FAFAFA",
            fontSize: "12px"
          }}
        />
      )
    } else {
      return (
        ""
      )
    }
  }
  const handleOptionChange = (index, field) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index].fieldId = field;
    updatedOptions[index].operator = " ";
    updatedOptions[index].value = null;
    setSelectedOptions(updatedOptions);
  };

  const handleConditionChange = (index, condition) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index].operator = condition;
    setSelectedOptions(updatedOptions);
  };

  const handleValueChange = (index, value) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index].value = value;
    setSelectedOptions(updatedOptions);
  };

  const handleAdd = () => {
    setSelectedOptions([...selectedOptions, ...initialOptions]);
  };

  const handleRemove = (index) => () => {
    setSelectedOptions((options) => {
      const updatedOptions = [...options];
      updatedOptions.splice(index, 1);
      return updatedOptions;
    });
  };

  const CustomSelect = styled(Select)`
    & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: none;
    }

    & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: none;
    }

    & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input {
      background-color: none;
      border-color: none;
    }
  `;

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        padding: "5px",
        marginTop: "40px",
      }}
    >
      <Typography
        fontWeight={500}
        fontSize={"24px"}
        fontFamily={"Roboto!important"}
      >
        Additional Filters
      </Typography>
      <div style={{ marginBottom: "10px" }}>
        {selectedOptions.map((option, index) => (
          <div
            key={index}
            style={{ marginTop: "10px", display: "flex", gap: "10px" }}
          >
            <Box
              sx={{ width: '100%', display: 'table', clear: 'both' }}>
              <Box sx={{ width: '15%', float: 'left', textAlign: 'center', maxWidth: '100px' }}>
                {index === 0 ? (
                  <Typography
                    sx={{ margin: "4px 0 0 0", textAlign: "center" }}
                    fontWeight={400}
                    fontSize={"12px"}
                    fontFamily={"Roboto!important"}
                    align={"center"}
                  >
                    Where
                  </Typography>
                ) : index === 1 ? (
                  <CustomSelect
                    value={selectedValue}
                    onChange={handleOperationChange}
                    style={{
                      background: "#FAFAFA",
                      height: "40px",
                      maxWidth: "75px",
                      width: "95%",
                      marginRight: "12px",
                      fontSize: "12px",
                      textAlign: "center"
                    }}
                  >
                    {Operation.map((op) => (
                      <MenuItem key={op.key} value={op.value}>
                        {op.value}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                ) : (
                  <div style={{ padding: "4px 0 0 0" }}>
                    {Operation.map((op) => (
                      <div key={op.key}>
                        <Typography
                          fontWeight={400}
                          fontSize={"12px"}
                          fontFamily={"Roboto!important"}
                          style={{
                            margin:
                              selectedValue === "AND"
                                ? "4px 0 0 0"
                                : "4px 0 0 0",
                            textAlign: "center"
                          }}
                        >
                          {op.value === selectedValue ? selectedValue : ""}
                        </Typography>
                      </div>
                    ))}
                  </div>
                )}
              </Box>
              <Box sx={{ width: '25%', float: 'left' }}>
                <CustomSelect
                  value={option.fieldId}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  style={{
                    width: "95%",
                    height: "40px",
                    borderRadius: "1px",
                    background: "#FAFAFA",
                    "&:hover": {
                      border: "none",
                    },
                    fontSize: "12px"
                  }}
                >
                  <MenuItem key=" " value=" ">
                    Select Field
                  </MenuItem>
                  {data.fields.map((field) => (
                    <MenuItem
                      key={field.key}
                      value={field.key}
                      style={{ backgroundColor: "white" }}
                    >
                      {field.value}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Box>
              <Box sx={{ width: '25%', float: 'left' }}>
                <CustomSelect
                  value={option.operator}
                  onChange={(e) => handleConditionChange(index, e.target.value)}
                  id="demo-simple-select"
                  style={{
                    width: "95%",
                    height: "40px",
                    borderRadius: "1px",
                    background: "#FAFAFA",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  <MenuItem key=" " value=" ">
                    Select Condition
                  </MenuItem>
                  {renderConditions(data.fields, option)}
                </CustomSelect>
              </Box>
              <Box sx={{ width: '25%', float: 'left' }}>
                &#8288;
                {renderValueField(data.fields, option, index)}
              </Box>

              {/*The Cross Buttom*/}

              <Box sx={{ width: '8%', float: 'left' }}>
                {index >= initialOptions.length && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    sx={{
                      width: "9px",
                      height: "40px",
                      "&:hover": {
                        backgroundColor: "none",
                      },
                    }}
                    onClick={handleRemove(index)}
                  >
                    X
                  </Button>
                )}
              </Box>
            </Box>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          label={"Add More"}
          variant="outlined"
          color="success"
          onClick={handleAdd}
        >
          <Typography fontWeight={500} fontSize={"14px"} lineHeight={1.75}>
            {" "}
            Add More
          </Typography>
        </Button>
      </div>
    </div>
  );
};

export default Filter;
