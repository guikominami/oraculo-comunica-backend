module.exports = function (req, res, next) {
   res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
   res.header("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
   res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
   );

   next();
};
