const express = require("express");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());

app.use("/v1", taskRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`));