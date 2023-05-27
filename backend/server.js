const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
const dotenv = require('dotenv');
const { createSocket } = require('./socket');
const http = require('http');
const cors = require('cors');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log("UNCAUGHT EXCEPTION! Shutting down...")
    //first of all we shout down the server,then close the application
    // server.close(()=>{
    process.exit(1);//killed all the pendding process
    // });
})

dotenv.config({ path: "./config.env" });
const app = require("./app");

const PORT = process.env.PORT || 5000;

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    //   .connect(process.env.DATABASE_LOCAL,{
    .connect(DB, {
        useNewUrlParser: true,
    }).then(() => {
        // console.log(con.connection);
        console.log("DB connection successfully!");
    });


//4.START SERVER
const server = http.createServer(app);

const corsOptions = {
    origin:'*'
};
app.use(cors(corsOptions));

try {
    createSocket(server);
    // createSocketForUser(server);
} catch (err) {
    console.log(err)
}

server.listen(PORT, () => {
    console.log("Server running...")
});


process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log("UNHANDLER REJECTION! Shutting down...")
    //first of all we shout down the server,then close the application
    server.close(() => {
        process.exit(1);//killed all the pendding process
    });
})
