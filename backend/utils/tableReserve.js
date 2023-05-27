'use strict';
const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {

    constructor(user, url) {
        this.to = "drashtikalathiya44@gmail.com";
        this.form = `<${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    //send the actual email
    async send(template, subject) {
        console.log(template, subject)
        let html;
        if (template == 'bookingDone') {
            html = `Booking Time ${bookingInTime} to ${bookingOutTime}`;
        }
        if (template == 'bookingCancel') {
            html = `Your Booking cancel successfully`;
        }


        //2)Define email options
        const mailOptions = {
            from: "drashtikalathiya44@gmail.com",
            to: this.to,
            template,
            subject: subject,
            html: html,
            text: convert(html)
        };

        //3)create a transport and send email
        await this.newTransport().sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent:', info.response)
            }
        });
    }

    async sendTableReserve() {
        await this.send('bookingDone', 'Thank you for Reservation')
    }
    async sendCancelTableReserve() {
        await this.send('bookingCancel', 'Your table cancel successfully')
    }
}


