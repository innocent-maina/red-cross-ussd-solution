/* eslint-disable no-console */
module.exports = (mongoose) => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@timetracker.elei8.mongodb.net/${process.env.MONGO_COLLECTION}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
    )
    .then(() => {
      const connectionValue = mongoose.connection.readyState;
      if (connectionValue === 1) {
        console.log('MongoDB connected ✨');
      } else if (connectionValue === 2) {
        console.log('MongoDB connecting');
      } else if (connectionValue === 3) {
        console.log('MongoDB disconnecting ❌');
      } else if (connectionValue === 4) {
        console.log('MongoDB disconnected ❌');
      }
    });
};
