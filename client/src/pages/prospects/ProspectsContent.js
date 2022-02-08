import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { Grid, CircularProgress, Checkbox, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl } from "@material-ui/core";
import PageTitle from "pages/mainlayout/PageTitle";
import PaginatedTable from "common/PaginatedTable";


const Content = ({
  paginatedData,
  isDataLoading,
  count,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  campaignData
}) => {
  const [checkedProspects, setCheckedProspects] = useState({});
  const [pageChecked, setPageChecked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(1);

  const handleItemCheck = event => {
    let newState = { ...checkedProspects };

    if (!event.target.checked) {
      delete newState[event.target.id];
    } else {
      newState[event.target.id] = true;
    }

    setCheckedProspects(newState);
  };

  const handlePageCheck = event => {
    let newState = { ...checkedProspects };

    if (event.target.checked) {
      rowData.forEach(i => {
        newState[i[0].props.id] = event.target.checked;
      });
    } else {
      rowData.forEach(i => {
        delete newState[i[0].props.id];
      });
    }

    setCheckedProspects({ ...newState });
  };

  useEffect(() => {
    const isEntirePageChecked = () => {
      let keys = Object.keys(checkedProspects);
      if (keys.length === 0) return false;

      for (let i in paginatedData) {
        let val = paginatedData[i].id.toString();
        if (keys.indexOf(val) === -1 || !checkedProspects[val]) return false;
      }

      return true;
    }
    setPageChecked(isEntirePageChecked());
  }, [checkedProspects, paginatedData]);

  const countStatement = () => {
    return (
      <>
        <Typography>{getSelectedCount} of {count} selected</Typography>
        <Box sx={{ m: 2 }}></Box>
      </>
    );
  };

  const addButton = () => {
    return (
      <Button variant="outlined"
        color="primary"
        onClick={handleModalOpen}>
        Add to Campaign
      </Button>
    );
  };

  const handleModalOpen = () => {
    if (getSelectedCount > 0) setModalOpen(true);
  };

  const handleModalClose = async (event) => {
    if (event.target.innerText === "Add") {
      try {
        const resp = await axios.post(
          `/api/campaigns/${selectedCampaign}/prospects`,
          { prospect_ids: Object.keys(checkedProspects)}
        );
      } catch (error) {
        console.log(error)
      }
    }
    setModalOpen(false);
  };

  const handleSelectChange = (event) => {
    setSelectedCampaign(event.target.value);
  };

  const getSelectedCount = Object.keys(checkedProspects).length;
  const campaignOptions = campaignData.map((campaign) => <MenuItem id={campaign.id} value={campaign.id}>{campaign.name}</MenuItem>);


  const rowData = paginatedData.map((row) => [
    <Checkbox color="primary" onChange={handleItemCheck} checked={checkedProspects[row.id] || false} id={row.id} />,
    row.email,
    row.first_name,
    row.last_name,
    moment(row.created_at).format("MMM d"),
    moment(row.updated_at).format("MMM d"),
  ]);

  return (
    <>
      <PageTitle>Prospects</PageTitle>
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
            <Checkbox color="secondary" onChange={handlePageCheck} checked={pageChecked} />,
            "Email",
            "First Name",
            "Last Name",
            "Created",
            "Updated",
          ]}
          rowData={rowData}
          actionArea={[countStatement(), addButton()]}
        />
      )}
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Select a Campaign to Add {getSelectedCount} Prospects</DialogTitle>
        <DialogContent>
          <FormControl>
          <InputLabel id="label-campaign">Campaign</InputLabel>
            <Select
              labelId="label-campaign"
              id="select-campaign"
              label="Campaign"
              onChange={handleSelectChange}
              value={selectedCampaign}
            >
              {campaignOptions}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleModalClose}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Content;
