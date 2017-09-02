const express = require("express");
const router = express.Router();
const TaricCode = require("../models/taric");
const TreeFilter = require("../models/tree-filter");

// Get all parent nodes from the Taric tree.
router.get("/", (req, res) => {
  TaricCode.find({ hierPos: "2" })
    .sort({
      hsChapter: 1,
      hsHeading: 1,
      hsSubheading: 1,
      cnSubheading: 1,
      taricCode: 1
    })
    .exec((err, nodes) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.status(200).json({ nodes });
    });
});

router.get("/:taric", (req, res) => {
  if (req.query.filterId) {
    TreeFilter.findById(req.query.filterId, (err, filter) => {
      getChildNodes(filter);
    });
  } else {
    getChildNodes();
  }
  function getChildNodes() {
    const segments = req.params.taric.match(/.{1,2}/g);
    console.log(segments);
    const query = {};

    let subnodeFound = false;
    if (segments[0] !== "-1") {
      query.hsChapter = segments[0];
    }

    subnodeFound = getQuerySegment(
      segments[1],
      subnodeFound,
      query,
      "hsHeading"
    );
    subnodeFound = getQuerySegment(
      segments[2],
      subnodeFound,
      query,
      "hsSubheading"
    );
    subnodeFound = getQuerySegment(
      segments[3],
      subnodeFound,
      query,
      "cnSubheading"
    );
    subnodeFound = getQuerySegment(
      segments[4],
      subnodeFound,
      query,
      "taricCode"
    );
    console.log("query", query);

    // console.log(query);
    TaricCode.find(query)
      .sort({
        hsChapter: 1,
        hsHeading: 1,
        hsSubheading: 1,
        cnSubheading: 1,
        taricCode: 1
      })
      .exec((err, nodes) => {
        if (err) {
          res.status(500).json(err);
          return;
        }
        res.status(200).json({ nodes });
      });
  }
});

function getQuerySegment(segment, subnodeFound, query, segmentName) {
  if (!subnodeFound && segment === "00") {
    subnodeFound = true;
    query[segmentName] = { $ne: "00" };
  } else {
    query[segmentName] = segment || "00";
  }
  return subnodeFound;
}

module.exports = router;