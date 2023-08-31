import GlobalForm from "./Reports/GlobalForm";

import InputBox from "./ui-components/InputBox";
import SelectDropdown from "./ui-components/SelectDropdown";
import MuiButtons from "./ui-components/Button";
import DatePickerRange from "./ui-components/DatePickerRange";
import CustomSearchInputBox from "./ui-components/CustomSearchInputBox";
import CustomDatePicker from "./ui-components/CustomDatePicker";
import CustomCheckBox from "./ui-components/CustomCheckBox";

export default function GeneratedForm() {
  return (
    <GlobalForm
      initialValues={{
        searchBox: "",
        dateVal: "",
        dateRangeOption: "",
        // actualDate: null,
        dateRange: { rangeDateStart: null, rangeDateEnd: null },
        customDate: "",
        searchKey: "",
        checkSearch: "",
        selectedCheckList: [],
        listSearch: "",
      }}
    >
      <Form />
    </GlobalForm>
  );
}

const Form = (props) => {
  let checkBoxOption = [
    { id: 0, label: "Apple" },
    { id: 1, label: "Astronaut" },
    { id: 2, label: "Ball" },
    { id: 3, label: "Cat" },
    { id: 4, label: "Cabbage" },
    { id: 5, label: "Banana" },
    { id: 6, label: "Dog" },
    { id: 7, label: "Dandelion" },
  ];

  let listOption = [
    { id: 0, label: "Record" },
    { id: 1, label: "Donut" },
    { id: 2, label: "Kakarot" },
    { id: 3, label: "One Piece" },
    { id: 4, label: "One punch man" },
    { id: 5, label: "Naruto" },
    { id: 6, label: "Death Note" },
    { id: 7, label: "Dandelion" },
  ];

  const COMPONENT_TYPE = ["CHECKBOX", "UI_LIST"];

  const populateFilteredComponent = (componentType, options, tag, storeTag) => {
    if (props.formikProps.values[tag] === "") {
      return options.map((el, index) => {
        switch (componentType) {
          case COMPONENT_TYPE[0]:
            return (
              <CustomCheckBox
                label={el.label}
                key={index}
                onCheck={() => props.formikProps.values[storeTag].push(el)}
                onUncheck={() => {
                  props.formikProps.values[storeTag] = props.formikProps.values[
                    storeTag
                  ].filter((el1) => el1.label !== el.label);
                }}
                isChecked={props.formikProps.values[storeTag].some(
                  (el1) => el1.label === el.label
                )}
              />
            );
          case COMPONENT_TYPE[1]:
            return (
              <div key={index}>
                <h3>{el.label}</h3>
              </div>
            );
          default:
            return null;
        }
      });
    } else {
      return options
        .filter((el) =>
          el.label
            .toLowerCase()
            .startsWith(props.formikProps.values[tag].toLowerCase())
        )
        .map((el, index) => {
          switch (componentType) {
            case COMPONENT_TYPE[0]:
              return (
                <CustomCheckBox
                  label={el.label}
                  key={index}
                  onCheck={() => props.formikProps.values[storeTag].push(el)}
                  onUncheck={() => {
                    props.formikProps.values[storeTag] =
                      props.formikProps.values[storeTag].filter(
                        (el1) => el1.label !== el.label
                      );
                  }}
                  isChecked={props.formikProps.values[storeTag].some(
                    (el1) => el1.label === el.label
                  )}
                />
              );
            case COMPONENT_TYPE[1]:
              return (
                <div key={index}>
                  <h3>{el.label}</h3>
                </div>
              );
            default:
              return null;
          }
        });
    }
  };

  return (
    <div>
      <InputBox
        tag={"searchBox"}
        formikProps={props?.formikProps}
        label={"Search Box"}
      />
      <InputBox
        tag={"dateVal"}
        formikProps={props?.formikProps}
        label={"Date Value"}
      />
      <SelectDropdown
        tag={"dateRangeOption"}
        formikProps={props?.formikProps}
        placeholder={"Select Date Range"}
        width={"200px"}
        options={[
          { id: 0, label: "Apple" },
          { id: 1, label: "Google" },
          { id: 2, label: "Range" },
        ]}
      />

      {props.formikProps.values.dateRangeOption?.label === "Range" && (
        <DatePickerRange
          tag={["rangeDateStart", "rangeDateEnd"]}
          formikProps={props?.formikProps}
          label={["Start Date", "End Date"]}
        />
      )}

      <CustomDatePicker
        tag={"customDate"}
        formikProps={props?.formikProps}
        placeholder={"Custom Picker"}
      />

      <CustomSearchInputBox
        tag={"searchKey"}
        formikProps={props?.formikProps}
        placeholder={"Search"}
        debounced
      />

      <InputBox
        tag={"numberBox"}
        formikProps={props?.formikProps}
        innerLabel={"Minimum"}
        numeric
      />

      {/* Checkbox filter */}
      <CustomSearchInputBox
        tag={"checkSearch"}
        formikProps={props?.formikProps}
        placeholder={"Search Checkbox"}
        debounced
      />
      {populateFilteredComponent(
        COMPONENT_TYPE[0],
        checkBoxOption,
        "checkSearch",
        "selectedCheckList"
      )}

      {/* Order list filter */}
      <CustomSearchInputBox
        tag={"listSearch"}
        formikProps={props?.formikProps}
        placeholder={"Search Menu List"}
        // debounced
      />
      {populateFilteredComponent(COMPONENT_TYPE[1], listOption, "listSearch")}

      <MuiButtons label={"Submit Report"} />
    </div>
  );
};
