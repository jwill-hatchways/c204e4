import React, { useEffect, useState } from "react";
import moment from "moment";

import { Grid, CircularProgress, Checkbox } from "@material-ui/core";

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
}) => {
  const [checkedProspects, setCheckedProspects] = useState({});
  const [pageChecked, setPageChecked] = useState(false);

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
    let newState = {}

    rowData.forEach(i => {
      newState[i[0].props.id] = event.target.checked;
    })

    setCheckedProspects({ ...checkedProspects, ...newState });
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
        />
      )}
    </>
  );
};

export default Content;
