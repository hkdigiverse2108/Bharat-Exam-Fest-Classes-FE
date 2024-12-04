import React from "react";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

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

export default function SingleSelect({
  label,
  options,
  selectedValue,
  onSubjectChange,
}) {
  return (
    <FormControl className="container h-full" size="small" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={selectedValue ? selectedValue._id : ""}
        onChange={onSubjectChange}
        displayEmpty
        fullWidth
      >
        {options && options.length > 0 ? (
          options.map((option) => (
            <MenuItem
              key={option._id}
              value={option._id}
              className="capitalize"
            >
              {option.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}
