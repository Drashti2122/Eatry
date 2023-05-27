const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const TableReservation = require('../models/tableReservation.model');
const dotenv = require('dotenv')
dotenv.config({ path: "./config.env" });
const stripe = require('stripe')(process.env.PAYMENT_SK);
const { EmitEvent } = require('../socket');
const Email = require("../utils/tableReserve");


exports.addPayment = catchAsync(async (req, res, next) => {
    const token = req.body.token;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount * 100,
        currency: 'inr',
        payment_method_types: ['card'],
    });

    //Confirm the Payment Intent
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, { payment_method: 'pm_card_amex_threeDSecureNotSupported' });

    EmitEvent("checkout", "Payment done")
    if (confirmedPaymentIntent) {
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "Payment Done",
            // data: { client_secret: confirmedPaymentIntent.client_secret },

        });
    } else {
        return next(new AppError('Something wrong!!Please try again'), 404)
    }

});

exports.addPaymentTable = catchAsync(async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntents.create({
        amount: 100 * 100,
        currency: 'inr',
        payment_method_types: ['card'],
    });
    //console.log(paymentIntent)

    //Confirm the Payment Intent
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, { payment_method: 'pm_card_amex_threeDSecureNotSupported' });

    //Handle the result and return the necessary data
    if (confirmedPaymentIntent) {
        let updateTableReserve = await TableReservation.findByIdAndUpdate({ _id: req.body.id }, { "payment_status": 'complete', "payment_intent": paymentIntent.id })
        if (updateTableReserve) {
            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: "Payment Done",
                // data: { client_secret: confirmedPaymentIntent.client_secret },
            });
        }
    } else {
        return next(new AppError('Something wrong!!Please try again'), 404)
    }
});

exports.refundTable = catchAsync(async (req, res, next) => {
    // //console.log(req.body)

    let tableReserve = await TableReservation.findById({ _id: req.body.id })
    if (tableReserve) {
        // //console.log(TableReserve.payment_intent)
        const refund = await stripe.refunds.create({
            payment_intent: tableReserve.payment_intent,
            amount: 50 * 100
        });
        // //console.log(refund)
        if (refund) {
            let delTableReserve = await TableReservation.findByIdAndDelete({ _id: req.body.id })

            EmitEvent("bookingCancel", "Booking cancelation")
            if (delTableReserve) {
                await new Email(delTableReserve, req.user.userEmail).sendCancelTableReserve().then(() => {
                    res.status(200).json({
                        status: 'success',
                        statusCode: 200,
                        message: "Your booking cancel successfully"
                    })
                });
            }
        }
    }
});