'use strict';
const passport = require('passport');
const express = require('express');
const router = express.Router();

const { User } = require('../models');
const { Calendar } = require('../models');
const { Diary } = require('../models');

const crypto = require('crypto');
const bcrypt = require('bcrypt');

const { userInfo } = require('os');
const { calendarInfo } = require('os');

const { isLoggedIn, isNotLoggedIn } = require('./passport/logInStatus');
const passportPublic = require('../public/javascripts/passport/index');

//@ localhost:3000
router.get('/', (req, res) => {
  res.render('index');
});

router.post('/', isNotLoggedIn, (req, res, next) => {
  // localStrategy 호출
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      console.log(authError);
      alert('가입되지 않은 회원입니다.');
      return next(authError); // 에러처리 미들웨어로 실행
    }
    if (!user) {
      console.log('password is not correct');
      return alert('비밀번호가 일치하지 않습니다');
    }
    // 로그인 성공. index 호출
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/main');
      console.log('login success');
    });
  })(req, res, next);
});

//@ localhost:3000/register
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', isNotLoggedIn, async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, birthDay } =
      req.body;
    // 기존 유저 확인 (중복 가입 방지)
    const existedUser = await User.findOne({ where: { email } });
    if (existedUser) {
      return res.redirect('/');
    }
    const hash = await bcrypt.hash(password, 12);
    const userInfo = await User.create({
      email,
      password: hash,
      firstName,
      lastName,
      phoneNumber,
      birthDay,
    });

    userInfo.save();
    console.log('your account is registered');
    res.redirect('/');
  } catch (error) {
    console.log('please try again');
    res.redirect('/register');
  }
});

//@ localhost:3000/calendar
router.get('/calendar', (req, res) => {
  res.render('calendar');
});

router.post('/calendar', async (req, res) => {
  try {
    const { title, date } =
      req.body;
    
    const calendarInfo = await Calendar.create({
      title,
      date
    });

    // calendarInfo.save();
    console.log('your Calendar is registered');
    res.redirect('/');
  } catch (error) {
    console.log('please try again');
    res.redirect('/calendar');
  }
});

//@ localhost:3000/main
router.get('/main', (req, res) => {
  res.render('main');
});

module.exports = router;
