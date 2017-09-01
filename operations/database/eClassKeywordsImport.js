// http://wiki.eclass.eu/wiki/csv_file_description

const mongoose = require("mongoose");
const parse = require("csv-parse");
const path = require("path");
const fs = require("fs");
const EClassCode = require("../../models/eclass");
require("dotenv").config({ path: "../../.env" });

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

const p = path.join(__dirname, "/../../", "data");
// console.log(p);

const parserKeywords = parse({ delimiter: ";" }, (err, data) => {
  console.log("data.length: ", data.length);
  for (let i = 1; i < data.length; i++) {
    // 0 SupplierKW/SupplierSY;
    // 1 Identifier;
    // 2 VersionNumber;
    // 3 IdCC/IdPR;
    // 4 KeywordValue/SynonymValue;
    // 5 Explanation;
    // 6 ISOLanguageCode;
    // 7 ISOCountryCode;
    // 8 TypeOfTargetSE;
    // 9 IrdiTarget;
    // 10 IrdiKW/IrdiSY;
    // 11 TypeOfSE

    const update = { keyword: data[i][4] };
    const irdi = data[i][9];

    EClassCode.findOneAndUpdate({ irdiCC: irdi }, update, err => {
      if (err) console.log(err);
    });
  }
});

fs.createReadStream(`${p}/eClass10_0_1_KWSY_en.csv`).pipe(parserKeywords);
