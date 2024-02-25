import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  Modal,
  TextField,
  TablePagination,
} from "@mui/material";
import data from "../frontendAssignment.json";
import CircularProgress from "@mui/material/CircularProgress";
import AddTripModal from "../Modals/Addtrip";
import EditTripModal from "../Modals/Edittrip";

function Dashboard() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newTripData, setNewTripData] = useState({
    transporter: "",
    source: "",
    dest: "",
    etaDays: 0,
  });

  const handleRowSelect = (row) => {
    const selectedIndex = selectedRows.indexOf(row);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
    setSelectedTrip(row); // Update selectedTrip state
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [tripsData, setTripsData] = useState(data.data);
  console.log("tripsData", tripsData);

  const handleAddTrip = (newTripData) => {
    const currentDate = new Date().toISOString();
    const newTrip = {
      _id: "65d5ebadf18f49fe4ef592c2",
      tripId: newTripData.tripId,
      transporter: newTripData.transporter || "FedEx",
      tripStartTime: currentDate,
      currentStatusCode: "IT",
      currenStatus: "In Transit",
      phoneNumber: newTripData.phone || 9852934197,
      etaDays: newTripData.etaDays || 1,
      distanceRemaining: newTripData.distanceRemaining || 716,
      tripEndTime: "",
      source: newTripData.source || "Mumbai",
      sourceLatitude: 8.6,
      sourceLongitude: 73.4,
      dest: newTripData.destination || "Nagpur",
      destLatitude: 36.3,
      destLongitude: 95.5,
      lastPingTime: currentDate,
      createdAt: currentDate,
    };

    setTripsData([newTrip, ...tripsData]);

    handleCloseModal();
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const cardStyle = {
    width: 240,
    height: 100,
    padding: "12px 24px",
    borderRadius: 8,
    border: "1px solid ##E0E0E0",
  };

  const calculateTATStatus = (trip) => {
    let TATStatus = "";

    if (trip.etaDays <= 0) {
      TATStatus = "Others";
    } else {
      const tripEndTime = trip.tripEndTime || trip.lastPingTime;
      const tripStartTime = new Date(trip.tripStartTime);
      const endTime = new Date(tripEndTime);
      const millisecondsInDay = 1000 * 60 * 60 * 24;
      const tripDurationDays = Math.ceil(
        (endTime - tripStartTime) / millisecondsInDay
      );

      if (tripDurationDays <= trip.etaDays) {
        TATStatus = "Ontime";
      } else {
        TATStatus = "Delayed";
      }
    }

    return TATStatus;
  };

  const getBackgroundColor = (TATStatus) => {
    switch (TATStatus) {
      case "Ontime":
        return "#C2FAEA";
      case "Delayed":
        return "#F9D7D7";
      case "Others":
        return "#FFECDB";
      default:
        return "white"; // Default background color
    }
  };

  const deliveredTrips = tripsData.filter(
    (trip) =>
      trip.currentStatusCode === "RD" &&
      trip.currenStatus === "Reached Destination"
  );
  const inTransitTrips = tripsData.filter(
    (trip) =>
      trip.currentStatusCode !== "RD" &&
      trip.currenStatus !== "Reached Destination"
  );
  const delayedTrips = tripsData.filter((trip) => {
    if (trip.etaDays <= 0) {
      // If etaDays is 0 or negative, consider it delayed
      return true;
    } else {
      const tripEndTime = trip.tripEndTime || trip.lastPingTime;
      const tripStartTime = new Date(trip.tripStartTime);
      const endTime = new Date(tripEndTime);
      const millisecondsInDay = 1000 * 60 * 60 * 24;
      const tripDurationDays = Math.ceil(
        (endTime - tripStartTime) / millisecondsInDay
      );

      // If the actual duration exceeds ETA, consider it delayed
      return tripDurationDays > trip.etaDays;
    }
  });

  const [onTimePercentage, setOnTimePercentage] = useState(0);

  useEffect(() => {
    const onTimeTrips = deliveredTrips.filter((trip) => {
      const tripEndTime = trip.tripEndTime || trip.lastPingTime;
      const tripStartTime = new Date(trip.tripStartTime);
      const endTime = new Date(tripEndTime);
      const millisecondsInDay = 1000 * 60 * 60 * 24;
      const tripDurationDays = Math.ceil(
        (endTime - tripStartTime) / millisecondsInDay
      );

      return tripDurationDays <= trip.etaDays;
    });

    const percentage = (onTimeTrips.length / deliveredTrips.length) * 100;
    const roundedPercentage = Math.round(percentage);
    setOnTimePercentage(roundedPercentage);
  }, []);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [updateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    transporter: "",
    time: "",
  });
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleOpenEditModal = (trip) => {
    setSelectedTrip(trip);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleUpdateTripStatus = (updatedData) => {
    console.log("Updated data:", updatedData);
    // Logic to update the trip status
    handleCloseEditModal();
  };

  return (
    <div style={{ overflowY: "auto" }}>
      {" "}
      {/* Make the page scrollable */}
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: "#243146" }}>
          <Typography variant="h6">Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 20, border: "1px solid" }}>
        <Grid container spacing={2} style={{ padding: "20px 0" }}>
          <Grid item xs={3}>
            <Card
              style={{
                ...cardStyle,
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <CardContent>
                <Typography variant="h6">Total Trips</Typography>
                <Typography variant="h4">{tripsData.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card
              style={{
                ...cardStyle,
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#C2FAEA", // On-time background color
              }}
            >
              <CardContent>
                <Typography variant="h6">On Time</Typography>
                <CircularProgress
                  variant="determinate"
                  value={onTimePercentage}
                >
                  <Typography variant="h6" style={{ color: "black" }}>
                    {`${Math.round(onTimePercentage)}%`}
                  </Typography>
                </CircularProgress>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card
              style={{
                ...cardStyle,
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#F9D7D7", // Delayed background color
              }}
            >
              <CardContent>
                <Typography variant="h6">Delayed</Typography>
                <Typography variant="h4">{delayedTrips?.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card
              style={{
                ...cardStyle,
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#FFECDB", // Other status background color
              }}
            >
              <CardContent>
                <Typography variant="h6">In Transit</Typography>
                <Typography variant="h4">{inTransitTrips?.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card style={{ padding: 10, marginTop: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 10px",
            }}
          >
            <div>Trip list</div>
            <div>
              {selectedTrip && ( // Conditionally render the button if a trip is selected
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpenEditModal(selectedTrip)}
                >
                  Update Status
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenModal}
                style={{ float: "right", marginLeft : 10 }}
              >
                Add Trip
              </Button>
            </div>
          </div>
          <Table style={{ marginTop: 10, padding: "0 10px" }}>
            <TableHead style={{ backgroundColor: "#E0E0E0", height: "20px" }}>
              <TableRow>
                <TableCell style={{ padding: "8px", height: "20px" }}>
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < tripsData.length
                    }
                    checked={selectedRows.length === tripsData.length}
                    onChange={() => handleRowSelect(null)}
                  />
                </TableCell>
                <TableCell style={{ padding: "8px", height: "20px" }}>
                  Trip ID
                </TableCell>
                <TableCell style={{ padding: "8px", height: "20px" }}>
                  Transporter
                </TableCell>
                <TableCell style={{ padding: "8px", height: "20px" }}>
                  Source
                </TableCell>
                <TableCell style={{ padding: "8px", height: "20px" }}>
                  Destination
                </TableCell>
                <TableCell style={{ padding: "8px", height: "20px" }}>
                  Phone
                </TableCell>
                <TableCell style={{ padding: "8px", height: "20px" }}>
                  ETA
                </TableCell>
                <TableCell style={{ padding: "8px", height: "20px" }}>
                  Distanace remaining
                </TableCell>
                <TableCell style={{ padding: "8px", height: "20px" }}>
                  Trip status
                </TableCell>
                <TableCell style={{ padding: "8px", height: "20px" }}>
                  TAT status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tripsData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row._id} style={{ height: "20px" }}>
                    <TableCell style={{ padding: "8px", height: "20px" }}>
                      <Checkbox
                        checked={selectedRows.indexOf(row) !== -1}
                        onChange={() => handleRowSelect(row)}
                      />
                    </TableCell>
                    <TableCell style={{ padding: "8px", height: "20px" }}>
                      {row.tripId}
                    </TableCell>
                    <TableCell style={{ padding: "8px", height: "20px" }}>
                      {row.transporter}
                    </TableCell>
                    <TableCell style={{ padding: "8px", height: "20px" }}>
                      {row.source}
                    </TableCell>
                    <TableCell style={{ padding: "8px", height: "20px" }}>
                      {row.dest}
                    </TableCell>
                    <TableCell style={{ padding: "8px", height: "20px" }}>
                      {row.phoneNumber}
                    </TableCell>
                    <TableCell style={{ padding: "8px", height: "20px" }}>
                      {row.etaDays}
                    </TableCell>
                    <TableCell style={{ padding: "8px", height: "20px" }}>
                      {row.distanceRemaining}
                    </TableCell>
                    <TableCell style={{ padding: "8px", height: "20px" }}>
                      <div
                        style={{
                          backgroundColor: "#D7E3FE",
                          color: "#24428A",
                          padding: 4,
                        }}
                      >
                        {row.currenStatus}
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "8px",
                        height: "20px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: getBackgroundColor(
                            calculateTATStatus(row)
                          ),
                          padding: 4,
                        }}
                      >
                        {calculateTATStatus(row)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <div
              style={{ textAlign: "right",  width: "80vw" }}
            >
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={tripsData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </Table>
        </Card>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div>
          <TextField
            label="Transporter"
            value={newTripData.transporter}
            onChange={(e) =>
              setNewTripData({ ...newTripData, transporter: e.target.value })
            }
          />
          <Button variant="contained" color="primary" onClick={handleAddTrip}>
            Add Trip
          </Button>
        </div>
      </Modal>
      <AddTripModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleAddTrip}
      />
      <EditTripModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateTripStatus}
      />
    </div>
  );
}

export default Dashboard;
