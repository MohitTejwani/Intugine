// EditTripModal.js

import React, { useState } from "react";
import { Modal, Button, Typography, TextField } from "@mui/material";

function EditTripModal({ open, onClose, onUpdate }) {
  const [statusUpdateData, setStatusUpdateData] = useState({
    transporter: "",
    time: ""
  });

  const handleStatusUpdate = () => {
    onUpdate(statusUpdateData);
    // onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <Typography variant="h6">Update Status</Typography>
        <TextField
          label="Transporter"
          value={statusUpdateData.transporter}
          onChange={(e) =>
            setStatusUpdateData({ ...statusUpdateData, transporter: e.target.value })
          }
        />
        <TextField
          label="Time"
          value={statusUpdateData.time}
          onChange={(e) =>
            setStatusUpdateData({ ...statusUpdateData, time: e.target.value })
          }
        />
        <Button variant="contained" color="primary" onClick={handleStatusUpdate}>
          Update
        </Button>
        <Button variant="contained" color="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

export default EditTripModal;
