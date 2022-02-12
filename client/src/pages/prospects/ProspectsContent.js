import React, { useEffect, useState } from "react";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import PageTitle from "pages/mainlayout/PageTitle";
import PaginatedTable from "common/PaginatedTable";
import UploadProspects from "./UploadProspects";
import {
  Grid,
  CircularProgress,
  Checkbox,
  Button,
  Typography,
  Box,
  Collapse,
  IconButton,
} from "@material-ui/core";

const Content = ({
  paginatedData,
  isDataLoading,
  count,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  campaignData,
}) => {
  const [checkedProspects, setCheckedProspects] = useState({});
  const [pageChecked, setPageChecked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState({
    severity: "success",
    open: false,
    msg: "",
  });

  const handleItemCheck = (event) => {
    const newState = { ...checkedProspects };

    if (!event.target.checked) {
      delete newState[event.target.id];
    } else {
      newState[event.target.id] = true;
    }

    setCheckedProspects(newState);
  };

  const handlePageCheck = (event) => {
    const newState = { ...checkedProspects };

    if (event.target.checked) {
      rowData.forEach((i) => {
        newState[i[0].props.id] = event.target.checked;
      });
    } else {
      rowData.forEach((i) => {
        delete newState[i[0].props.id];
      });
    }

    setCheckedProspects({ ...newState });
  };

  useEffect(() => {
    const isEntirePageChecked = () => {
      const keys = Object.keys(checkedProspects);
      if (keys.length === 0) return false;

      for (const i in paginatedData) {
        const val = paginatedData[i].id.toString();
        if (keys.indexOf(val) === -1 || !checkedProspects[val]) return false;
      }

      return true;
    };
    setPageChecked(isEntirePageChecked());
  }, [checkedProspects, paginatedData]);

  const handleModalOpen = () => {
    if (getSelectedCount > 0) setModalOpen(true);
  };

  const handleModalClose = (alertStatus) => {
    if (!alertStatus) setModalOpen(false);

    if (alertStatus.severity === "success") setCheckedProspects({});
    setAlert(alertStatus);
    setModalOpen(false);
  };

  const getSelectedCount = Object.keys(checkedProspects).length;

  const addButton = (
    <Button variant="outlined" color="primary" onClick={handleModalOpen}>
      Add to Campaign
    </Button>
  );

  const countStatement = (
    <>
      <Typography>
        {getSelectedCount} of {count} selected
      </Typography>
      <Box sx={{ m: 2 }}></Box>
    </>
  );

  const rowData = paginatedData.map((row) => [
    <Checkbox
      color="primary"
      onChange={handleItemCheck}
      checked={checkedProspects[row.id] || false}
      id={row.id}
    />,
    row.email,
    row.first_name,
    row.last_name,
    moment(row.created_at).format("MMM d"),
    moment(row.updated_at).format("MMM d"),
  ]);

  return (
    <>
      <PageTitle>Prospects</PageTitle>
      <Collapse in={alert.open}>
        <Alert
          severity={alert.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert({ ...alert, open: false });
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alert.msg}
        </Alert>
      </Collapse>
      {isDataLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : (
        <PaginatedTable
          paginatedData={paginatedData}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          headerColumns={[
            <Checkbox
              color="secondary"
              onChange={handlePageCheck}
              checked={pageChecked}
            />,
            "Email",
            "First Name",
            "Last Name",
            "Created",
            "Updated",
          ]}
          rowData={rowData}
          actionArea={[countStatement, addButton]}
        />
      )}

      <UploadProspects
        open={modalOpen}
        onClose={handleModalClose}
        count={getSelectedCount}
        campaignData={campaignData}
        checkedProspects={checkedProspects}
      />
    </>
  );
};

export default Content;
