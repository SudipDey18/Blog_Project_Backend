import express from 'express'
import emailVerificationControler from '../controllers/emailVerificationControler.js';

const {requestOtp} = emailVerificationControler;

const route = (express.Router());

route.get('/:for/requestotp',requestOtp);

export default route;