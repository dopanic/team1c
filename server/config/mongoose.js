const mongoose = require('mongoose');

mongoose.connect(process.env.mongoDB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// catch the error during the connection to MongoDB Atlas
let mongo = mongoose.connection;
mongo.on('error', console.error.bind(console, 'Connection Error:'));
mongo.once('open', () => {
  console.log('Connected to MongoDB...');
});