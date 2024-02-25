import React from "react";
import {
  Modal,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const transporters = [
  "Blue Dart",
  "BHL",
  "Delhivery",
  "DTDC",
  "Gati",
  "SafeExpress",
];

const AddTripModal = ({ open, onClose, onSubmit }) => {
  const [tripId, setTripId] = React.useState("");
  const [source, setSource] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [transporter, setTransporter] = React.useState("");
  const [destination, setDestination] = React.useState("");

  const handleAddTrip = () => {
    const newTrip = { tripId, source, phone, transporter, destination };
    onSubmit(newTrip);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Grid
        container
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          backgroundColor: "white",
          padding: 20,
          borderRadius: 8,
        }}
      >
        <Grid item xs={6}>
          <TextField
            label="Trip ID"
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            fullWidth
          />
          <TextField
            label="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Select
            value={transporter}
            onChange={(e) => setTransporter(e.target.value)}
            fullWidth
          >
            {transporters.map((t, index) => (
              <MenuItem key={index} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            fullWidth
          />
        </Grid>
        <Button variant="contained" color="primary" onClick={handleAddTrip}>
          Add Trip
        </Button>
      </Grid>
    </Modal>
  );
};

export default AddTripModal;
