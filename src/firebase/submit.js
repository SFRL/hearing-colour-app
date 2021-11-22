import { USERID, db } from "./init";
import { ref, set } from "firebase/database";

const submitData = (data) => {
  // Save time series of submission first
  set(ref(db, `${USERID}/${data.timestamp}`), data.colour)
    .then(console.log("Data has been submitted"))
    .catch(function (error) {
      console.log("Synchronisation failed!");
    });
  // Keep separate array with last submission
  set(ref(db, `currentBlobs/${USERID}`), {
    colour: data.colour,
    timestamp: data.timestamp,
  })
    .then(console.log("Updated blob entry"))
    .catch(function (error) {
      console.log("Blob entries could not be updated");
    });
};

export default submitData;
