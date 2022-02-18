import React, { useState } from "react";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";
import { useProspectStyles } from "../../styles/prospects";

const UploadProspectsDialog = ({ open, onClose, count, checkedProspects }) => {
  const [selectedCampaign, setSelectedCampaign] = useState({
    name: "",
    id: -1,
  });
  const [searchString, setSearchString] = useState("");
  const [campaignData, setcampaignData] = useState([]);
  const { formFieldWidth } = useProspectStyles();

  const upload = async () => {
    const newAlert = {};

    try {
      await axios.post(`/api/campaigns/${selectedCampaign.id}/prospects`, {
        prospect_ids: Object.keys(checkedProspects),
      });
      newAlert.open = true;
      newAlert.severity = "success";
      newAlert.msg = `Prospects added to ${selectedCampaign.name}`;
    } catch (error) {
      console.error(error);
      newAlert.open = true;
      newAlert.severity = "error";
      newAlert.msg = `Failed to add prospects to ${selectedCampaign.name}`;
    }

    onClose(newAlert);
  };

  const handleSelectChange = (_, newValue) => {
    setSelectedCampaign(newValue);
  };

  const handleInputChange = async (_, newValue) => {
    setSearchString(newValue);
    if (newValue === "") return;

    try {
      const res = await axios.get(`/api/campaigns/search?query=${newValue}`);
      setcampaignData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select a Campaign to Add {count} Prospects</DialogTitle>
      <DialogContent>
        <Autocomplete
          id="select-campaign"
          value={selectedCampaign}
          options={campaignData}
          getOptionLabel={(option) => option.name}
          onChange={handleSelectChange}
          onInputChange={handleInputChange}
          className={formFieldWidth}
          inputValue={searchString}
          renderInput={(params) => (
            <TextField {...params} label="Campaign" variant="outlined" />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={upload}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadProspectsDialog;
