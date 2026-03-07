import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      backgroundColor: 'black',
      color: 'white'
    },
  },
};

function getStyles(name, valueName, theme) {
  return {
    fontWeight: valueName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelectChip({ label, valueName, setValueName, valueList, gap }) {
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setValueName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{m: gap }}>
      <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={valueName}
        onChange={handleChange}
        input={
          <OutlinedInput
            id="select-multiple-chip"
            label={label}
            sx={{
              width: '100%',
              minHeight: '56px',
              '& .MuiSelect-outlined': {
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />
        }
        renderValue={(selected) => (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              width: '100%',
              minHeight: '56px',
              alignItems: 'center',
            }}
          >
            {selected.length > 0 ? (
              selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  sx={{ color: 'white', bgcolor: 'black', height: '24px' }}
                />
              ))
            ) : (
              <span style={{ color: 'rgba(0,0,0,0.38)' }}>{label}</span> 
            )}
          </Box>
        )}
        MenuProps={MenuProps}
        sx={{ width: '100%' }}
      >
        {valueList.map((value) => (
          <MenuItem
            key={value}
            value={value}
            style={getStyles(value, valueName, theme)}
          >
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
