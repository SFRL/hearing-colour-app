import { USERID, db } from "./init";
import { ref, remove } from "firebase/database";

const removeBlob = () => {
    console.log('Remove stuff');
  remove(ref(db, `current_blobs/${USERID}`))
    .then(console.log("Removed blob entry"))
    .catch(function (error) {
      console.log("Blob entries could not be removed");
    });
};

export default removeBlob;
