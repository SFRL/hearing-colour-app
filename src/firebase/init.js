import config from "./config";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

const app = initializeApp(config);
const db = getDatabase();

const getUserId = () => {
  // TODO: get ID from cookies
  const cookieId = false;
  // If not, generate a user id
  if (cookieId) return cookieId;
  else return uuidv4();
};

const USERID = getUserId();

export { USERID, db };
