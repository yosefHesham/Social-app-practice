const mongoose = require("mongoose");
module.exports = function () {
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`connected to ${process.env.DB} `);
};
