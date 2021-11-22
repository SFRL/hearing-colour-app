// This script simulates interaction from different users
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

// Setup database
const config = {
  apiKey: "AIzaSyBJ0MgZlw_zMvAmDq9HmAIV5_DuEgmhftQ",
  authDomain: "colour-app-33f44.firebaseapp.com",
  databaseURL:
    "https://colour-app-33f44-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "colour-app-33f44",
  storageBucket: "colour-app-33f44.appspot.com",
  messagingSenderId: "438290035985",
  appId: "1:438290035985:web:97da78594564bd06a808b0",
};

const app = initializeApp(config);
const db = getDatabase();

const getUserId = () => {
  // TODO: get ID from cookies
  const cookieId = false;
  // If not, generate a user id
  if (cookieId) return cookieId;
  else return uuidv4();
};

const getColour = function (interX, interY) {
  let x = interX - 0.5;
  let y = interY - 0.5;
  // Hue will be described angle between interX and interY
  let angle = (Math.atan2(y, x) / Math.PI + 1) * 180;
  let length = Math.max(Math.abs(x), Math.abs(y));
  let hue = angle;
  let sat = 100;
  let light = (1 - 1.2 * length) * 100;

  return `hsl(${hue},${sat}%,${light}%)`;
};

// Define Test User class
class TestUser {
  constructor(db) {
    this.id = getUserId();
    this.colour = getColour(Math.random(), Math.random());
    this.timeUntilUpdate = Math.random() * 16 + 4;
    this.db = db;
    this.submit();
  }

  submit() {
    // Save time series of submission first
    const d = new Date();
    const timestamp = d.getTime();
    const db = this.db;
    set(ref(db, `${this.id}/${timestamp}`), this.colour);
    // Keep separate array with last submission
    set(ref(db, `currentBlobs/${this.id}`), {
      colour: this.colour,
      timestamp: timestamp,
    });
  }

  updateColour(x, y) {
    this.colour = getColour(x, y);
  }

  updateTime(inc) {
    this.timeUntilUpdate = Math.max(this.timeUntilUpdate - inc, 0);
    if (this.timeUntilUpdate <= 0) {
      this.submit();
      this.updateColour(Math.random(), Math.random());
      // Get a time between 4 and 90 seconds
      this.timeUntilUpdate = Math.random() * 16 + 4;
    }
  }
}

const testrun = (N) => {
  // Create array with test users
  const users = Array.from({ length: N }, () => new TestUser(db));

  // Set interval to update functions
  const updateUsers = (inc) => {
    for (let user in users) {
      users[user].updateTime(inc);
    }
  };
  setInterval(updateUsers, 1000, 1);
};

// Run test with specified number of testusers
testrun(60);
