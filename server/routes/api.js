const router = require("express").Router;
const Db = require("./../db/mongo.js");

router.get("/getUsers", (req,res)=> {
  Db.getUsers((err,data)=> {
    if(err) {
      console.log(err);
    }
    res.json(data)
  });
});

router.get("/", (req,res)=> {
  res.json({
    path:"/api",
    status:"ok"
  })
});

module.exports = router;