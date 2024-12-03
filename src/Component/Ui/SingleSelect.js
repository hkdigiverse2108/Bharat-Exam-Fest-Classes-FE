import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

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
  selectedValue,
  onChange,
  options,
}) {
  return (
    <>
      <FormControl className="container h-full" size="small" fullWidth>
        <Select
          id={label}
          value={selectedValue}
          onChange={onChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {options && options.length > 0 ? (
            options?.map((option) => (
              <MenuItem key={option._id} value={option} className="capitalize">
                {option.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="">
              <em>No Options Available</em>
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </>
  );
}
