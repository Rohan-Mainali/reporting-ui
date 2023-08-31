import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const PaperComponent = styled(Paper)(({ theme, width }) => ({
  '& .MuiPaper-rounded': {
    borderRadius: 0,
    background: 'pink',
  }
}))
const MenuComponent = styled(Menu)(({ theme, width }) => ({
  '& .MuiList-root': {
    width: width,
    margin: '1px 0px',
  }
}))

const MenuListComponent = styled(MenuItem)(({ theme, height }) => ({
  '&.MuiMenuItem-root': {
    height: height,
    fontSize: '12px',
    lineHeight: '15px'

  },
  '&.Mui-active': {
    position: 'relative',
    // background: '#F4F8FF',
  },
  '&.Mui-selected::before': {
    content: `""`,
    position: 'absolute',
    left: '0',
    top: '0',
    width: '2px',
    height: height,
    // background: '#2868F3',
    borderRadius: '0px 2px 2px 0px',
  }
}))

export default function SelectDropdown(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const route = useSelector(state => state.route);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  React.useEffect(() => {
    if (props.tag === 'date_range_option') {
      props.formikProps.setFieldValue('date_range_option', route.dateArray[props.default]);
      setRange(route.dateArray[props.default]);
    }

    if (props.tag === 'scheduleFrequency') {
      props.formikProps.setFieldValue('scheduleFrequency', props.default)
    }
  }, [route.dateArray])

  const setRange = (data) => {
    let start = null, end = null;
    if (data) {
      switch (data.value) {
        case "Month To Date":
          props.formikProps.setFieldValue('date_range', {
            range_date_start: moment().startOf('month').utc(true).format('YYYY-MM-DD'),
            range_date_end: moment().startOf('days').subtract(1, 'days').utc(true).format('YYYY-MM-DD')
          })
          break;
        case "Year To Date":
          props.formikProps.setFieldValue('date_range', {
            range_date_start: moment().startOf('year').utc(true).format('YYYY-MM-DD'),
            range_date_end: moment().startOf('days').subtract(1, 'days').utc(true).format('YYYY-MM-DD')
          })
          break;
        case "Previous Calendar Month":
          props.formikProps.setFieldValue('date_range', {
            range_date_start: moment().startOf('month').subtract(1, 'days').startOf('month').utc(true).format('YYYY-MM-DD'),
            range_date_end: moment().startOf('month').subtract(1, 'days').utc(true).format('YYYY-MM-DD')
          })
          break;
        default:
          start = moment().subtract(Number(data?.key) + 1, 'd').utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD');
          if (start != null) {
            end = moment().subtract(1, 'd').utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD');
            props.formikProps.setFieldValue('date_range', {
              range_date_start: start, range_date_end: end
            })
          }
          break;
      }
    }
  }
  const handleDropdownClose = (el) => {
    // el && handleUpdateActiveOption(el);
    if (el !== undefined) {
      if (props.tag === 'scheduleFrequency') {
        props.formikProps.setFieldValue(props.tag, el);
      } else {
        props.formikProps.setFieldValue(props.tag, el);
        setRange(el)
      }
    }
    setAnchorEl(null);
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <div onClick={handleClick} style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        border: '.5px solid #CCCCCC',
        borderRadius: '2px',
        background: '#FAFAFA',
        padding: '10px 5px',
        width: props.width ? props.width : 'auto',
      }}>

        <div style={{ padding: '0 0.5rem', flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="formText">
            {/* {activeOption && activeOption[compareOptionKey] ? activeOption[compareOptionKey] : placeholder} */}
            {props.formikProps.values[props.tag] ? {
              'supplierOption': props.formikProps.values[props.tag].supplier_name,
              'manufacturerOption': props.formikProps.values[props.tag].manufacturer_name,
              'date_range_option': props.formikProps.values[props.tag].value,
              'scheduleFrequency': props.formikProps.values[props.tag].value
            }[props.tag] : props.placeholder}
          </Typography>

          {/* Suffix */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant="formText" >Select</Typography>
            <KeyboardArrowDownIcon color='smallGreen' />
          </div>
        </div>
      </div>

      <PaperComponent square={true}>
        <MenuComponent
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleDropdownClose()}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          TransitionComponent={Fade}
          width={props.width ? props.width : '100%'}
        >
          {
            (props.fromSlice) ?

              route.dateArray.map((el, index) => (
                <MenuListComponent
                  key={index}
                  height={'35px'}
                  // selected={activeOption && el.label === activeOption.label}
                  onClick={() => handleDropdownClose(el)}
                >
                  {el && el.value}
                </MenuListComponent>
              )) :
              props.options.map((el, index) => (
                <MenuListComponent
                  key={index}
                  height={'35px'}
                  // selected={activeOption && el.label === activeOption.label}
                  onClick={() => handleDropdownClose(el)}
                >
                  {el &&
                    {
                      'supplierOption': el.supplier_name,
                      'manufacturerOption': el.manufacturer_name,
                      'date_range_option': el.value,
                      'scheduleFrequency': el.value
                    }[props.tag]
                  }
                </MenuListComponent>
              ))
          }
        </MenuComponent>
      </PaperComponent>
    </div>
  );
}
