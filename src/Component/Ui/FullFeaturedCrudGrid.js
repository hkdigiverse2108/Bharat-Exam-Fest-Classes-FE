import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from "@mui/x-data-grid-generator";

const roles = ["Market", "Finance", "Development"];
const randomRole = () => {
  return randomArrayItem(roles);
};

const initialRows = [
  {
    id: randomId(),
    name: randomTraderName(),
    age: 25,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 36,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 28,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 23,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
];

// EditToolbar component
// function EditToolbar(props) {
//   const { setRows, setRowModesModel } = props;

//   const handleClick = () => {
//     const id = randomId();
//     setRows((oldRows) => [
//       ...oldRows,
//       { id, name: "", age: "", role: "", isNew: true },
//     ]);
//     setRowModesModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
//     }));
//   };

//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   );
// }

function EditToolbar(props) {
  const { setRows, setRowModesModel, questionType } = props;

  const handleClick = () => {
    const id = randomId(); // Generate a random id
    const newRow = {
      id,
      isNew: true,
      ...(questionType === "pair"
        ? { pairA: "", pairB: "" }
        : { statement: [""] }),
    };

    setRows((oldRows) => [...oldRows, newRow]);

    // Set the row to Edit mode, focus on the appropriate field
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: {
        mode: GridRowModes.Edit,
        fieldToFocus: questionType === "pair" ? "pairA" : "statement",
      },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

// FullFeaturedCrudGrid component
export default function FullFeaturedCrudGrid({
  pairQuestion,
  language,
  handleChange,
  questionType,
}) {
  const [rows, setRows] = React.useState(() => {
    return (
      pairQuestion?.map((pair) => {
        // If questionType is "statement", handle it directly as "statement" field
        if (questionType === "statement") {
          return { id: pair.id, statement: pair.statement };  // Convert to an array for statements
        }
  
        // If it's "pair" type, process it accordingly
        if (questionType === "pair" && pair.combined && pair.combined.includes("---")) {
          const [pairA, ...rest] = pair.combined.split("---");
          const pairB = rest.join("---").trim();
          return { id: pair.id, pairA: pairA.trim(), pairB: pairB.trim() };
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
    const updatedRow = rows.find((row) => row.id === id);
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, isNew: false } : row))
    );
    handleChange({ type: "save", rowIndex: id, rowData: updatedRow }, language);
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    const deletedRow = rows.find((row) => row.id === id);
    handleChange(
      { type: "delete", rowIndex: id, rowData: deletedRow },
      language
    );
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
      handleChange({ type: "cancel", rowIndex: id }, language);
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    if (questionType === "statement") {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === newRow.id
            ? { ...row, statement: [...row.statement, newRow.statement] }
            : row
        )
      );
    } else {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === newRow.id ? { ...newRow, isNew: false } : row
        )
      );
    }

    handleChange(
      { type: "update", rowIndex: newRow.id, rowData: newRow },
      language
    );

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: questionType === "pair" ? "pairA" : "statement",
      headerName: questionType === "pair" ? "Pair A" : "Statement",
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
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
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
