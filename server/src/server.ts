import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CareerBridge server is running on port ${PORT}`);
});