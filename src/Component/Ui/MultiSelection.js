import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

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

export default function MultipleSelect({ label, value, onChange, options }) {
  
  return (
    <>
      <FormControl className="container h-full">
        <InputLabel id={`${label}-label`} size="small">
          {label}
        </InputLabel>
        <Select
          multiple
          label={label}
          value={value}
          onChange={onChange}
          renderValue={(selected) => selected.map((s) => s.name).join(", ")}
          size="small"
          MenuProps={MenuProps}
        >
          {options.map((subtopic) => (
            <MenuItem key={subtopic._id} value={subtopic}>
              {subtopic.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
