const app = require("./app");

const port = process.env.PORT || 5000;

if (!process.env.JWT_KEY) {
  console.error("FATAL ERROR : JWT Private Key is not defined ");
  process.exit(1);
}
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
