import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

const ITEM_HEIGHT = 20;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function FilterQuestion({ label, value, onChange, options }) {
  return (
    <>
      <FormControl className="container h-full" size="small">
        <Select
          labelId="my-select-label"
          value={value}
          onChange={onChange}
          displayEmpty
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {options.map((value) => (
            <MenuItem key={value._id} value={value}>
              {value.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
