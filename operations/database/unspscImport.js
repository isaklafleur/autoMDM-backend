const fs = require("fs");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const UNSPSCCode = require("../../models/unspsc");
require("dotenv").config({ path: "../../.env" });

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

const lineReader = require("readline").createInterface({
  input: fs.createReadStream("./../../data/UNSPSC_v19.csv")
});

lineReader.on("line", line => {
  const l = line.split(";");
  const r = {};
  // 0 Segment;
  r.segment = l[0];
  // 1 Segment Title;
  r.segmentTitle = l[1];
  // 2 Family;
  r.family = l[2];
  // 3 Family Ttile;
  r.familyTitle = l[3];
  // 4 Class;
  r.class = l[4];
  // 5 Class Title;
  r.classTitle = l[5];
  // 6 Key;
  r.key = l[6];
  // 7 Commodity;
  r.commodity = l[7];
  // 8 Commodity Title;
  r.commodityTitle = l[8];
  // 9 Definition;
  r.definition = l[9];
  // 10 Synonym
  r.synonym = l[10];

  const record = new UNSPSCCode(r);

  record
    .save()
    .then(() => {
      mongoose.disconnect();
    })
    .catch(err => {
      console.log("There was an error", err);
    });
});