import React from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

function EditToolbar(props) {
  const { setRows, setRowModesModel, questionType } = props;

  const handleClick = () => {
    const id = Math.random().toString(36).substr(2, 9); // Generate a unique ID
    const newRow =
      questionType === "statement"
        ? { id, statement: "", isNew: true }
        : { id, pairA: "", pairB: "", isNew: true };

    setRows((oldRows) => [...oldRows, newRow]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: {
        mode: GridRowModes.Edit,
        fieldToFocus: questionType === "statement" ? "statement" : "pairA",
      },
    }));
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", padding: "10px" }}
    >
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
      {/* Additional buttons can be added here if needed */}
    </Box>
  );
}

export default function FullFeaturedCrudGrid({
  pairQuestion,
  onHandleChange,
  language,
  questionType,
}) {
  const [rows, setRows] = React.useState(() => {
    return (
      pairQuestion?.map((pair, index) => {
        const id = pair.id || index; // Ensure you have a unique ID
        if (questionType === "statement") {
          return { id: id, statement: pair.statement };
        }

        if (
          questionType === "pair" &&
          pair.combined &&
          pair.combined.includes("---")
        ) {
          const [pairA, ...rest] = pair.combined.split("---");
          const pairB = rest.join("---").trim();
          return { id, pairA: pairA.trim(), pairB: pairB.trim() };
        }

        return null;
      }) || []
    );
  });

  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    // Remove the row from the state
    const deletedRow = rows.find((row) => row.id === id);

    // Remove the row from the rows state
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);

    if (onHandleChange) {
      onHandleChange({ type: "delete", rowData: deletedRow }, language);
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id)); // Remove the new row if canceled
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    if (onHandleChange) {
      onHandleChange({ type: "update", rowData: newRow }, language); // Call the onHandleChange function
    }

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleProcessRowUpdateError = (error) => {
    console.error("Error processing row update:", error);
  };

  const columns = [
    {
      field: questionType === "pair" ? "pairA" : "statement",
      headerName: questionType === "pair" ? " Pair A" : "Statement",
      flex: 1,
      minWidth: 180,
      editable: true,
    },
    ...(questionType === "pair"
      ? [
          {
            field: "pairB",
            headerName: "Pair B",
            flex: 1,
            minWidth: 220,
            editable: true,
          },
        ]
      : []),
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id} // Use this to specify how to get the row ID
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, questionType },
        }}
      />
    </Box>
  );
}

// export default EmployeeDetailsTable;
