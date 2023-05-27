const express = require('express');
const app = express();

const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const globalErrorHandler = require('./controllers/error.controller')
const AppError = require('./utils/appError')
const categoryRouter = require('./routes/category.routes')
const subCategoryRouter = require('./routes/subCategory.routes')
const itemRouter = require('./routes/item.routes')
const tableRouter = require('./routes/table.routes')
const tableReservationRouter = require('./routes/tableReservation.routes')
const userRouter = require('./routes/user.routes')
const orderRouter = require('./routes/order.routes')
const adminRouter = require('./routes/admin.routes')
const otpUserRouter = require('./routes/otpUser.routes')
const billRouter = require('./routes/bill.routes')
const paymentRouter = require('./routes/payment.routes')
const notificationRouter = require('./routes/notification.routes')
const likeRouter = require('./routes/like.routes')
const filterRouter = require('./routes/filtering.routes')
const reportRouter = require('./routes/reports.routes')
const dashPanelRouter = require('./routes/dash-panel.routes')

app.use(morgan('dev'))
console.log(process.env.NODE_ENV)

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Set Security HTTP headers
app.use(helmet());


//Development logging
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

//Limit requests from same API
// const limiter = rateLimit({
//     max: 100,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many requests from this IP,Please try again in an hour!'//100 request from the same IP address in 1 hour
// })
// app.use('/api', limiter);

app.use(fileUpload({
    useTempFiles: true
}))

//Body parser,reading data from body into req.body
app.use(express.json())
// app.use(express.json({ limit: '50kb' }));

app.use(cors({ origin: '*' }))

//Data sanitization against NoSQL query injection(filter out all $ sign and .)
app.use(mongoSanitize());

//Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
}));

//Test middleware 
// app.use((req, res, next) => {
//     req.requestTime = new Date().toISOString();
//     // console.log(JSON.stringify(req.headers));
//     next();
// })

app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/subCategory', subCategoryRouter)
app.use('/api/v1/item', itemRouter)
app.use('/api/v1/table', tableRouter)
app.use('/api/v1/tableReservation', tableReservationRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/otpUser', otpUserRouter)
app.use('/api/v1/bill', billRouter)
app.use('/api/v1/payment', paymentRouter)
app.use('/api/v1/notification', notificationRouter)
app.use('/api/v1/like', likeRouter)
app.use('/api/v1/filter', filterRouter)
app.use('/api/v1/reports', reportRouter)
app.use('/api/v1/dash-panel', dashPanelRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this Server!`, 404));
})

app.use(globalErrorHandler);

module.exports = app;