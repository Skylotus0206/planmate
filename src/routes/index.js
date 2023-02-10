"use strict";
const passport = require("passport");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { User } = require("../models");
const { Calendar } = require("../models");
const { Diary } = require("../models");
const { Plan } = require("../models");

// const { userInfo } = require('os');
const { calendarInfo } = require("os");
const { isLoggedIn, isNotLoggedIn } = require("./passport/logInStatus");


//@ localhost:3000
router.get("/", (req, res) => {
  res.render("index");
});

router.post("/", isNotLoggedIn, (req, res, next) => {
  // localStrategy 호출
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      console.log(authError);
      return next(authError); // 에러처리 미들웨어로 실행
    }
    if (!user) {
      console.log("password is not correct");
      return res.render("alerts/login", {
        error: info.message,
      });
    }
    // 로그인 성공. index 호출
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      console.log("Login Success: " + user.email);
      return res.redirect("/main");
    });
  })(req, res, next);
});

//@ localhost:3000/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 위에서 구글 서버 로그인이 되면, 아래 로직 실행
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/main",
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

//@ localhost:3000/register
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", isNotLoggedIn, async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, birthDay } =
      req.body;
    // 기존 유저 확인 (중복 가입 방지)
    const existedUser = await User.findOne({ email: email });
    if (existedUser) {
      return res.redirect("/");
      //@ 존재하는 유저입니다 알람띄우기
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
    console.log("your account is registered");
    res.redirect("/");
  } catch (error) {
    console.log("please try again");
    res.redirect("/register");
  }
});

//@ localhost:3000/calendar
router.get("/calendar", (req, res) => {
  res.render("calendar");
});

router.post("/calendar", async (req, res) => {
  try {
    const { title, date } = req.body;

    const calendarInfo = await Calendar.create({
      title,
      date,
    });

    // calendarInfo.save();
    console.log("your Calendar is registered");
    res.redirect("/");
  } catch (error) {
    console.log("please try again");
    res.redirect("/calendar");
  }
});

//@ localhost:3000/main
router.get('/main', (req, res) => {
  Diary.find({}, function(err, result) {
    res.render('main');
  })
  res.render('main')
});

router.get('/main/:diary', (req, res) => {
  Diary.find({}, function(err, result) {
    res.send({data: result});
  })
});

router.post("/main", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("inside post /main callback");
    req.login(user, async (err) => {
      try {
        console.log("try");
        const { writer, written_date, comment, feelingconURL } = req.body;
        const diaryInfo = await Diary.create({
          writer, //user.firstName
          written_date,
          comment,
          feelingconURL,
        });
        console.log(passport.session()); //isLoggedIn,
        diaryInfo.save();
        console.log("diary 내용이 저장됨");
      } catch (err) {
        console.log("diary 저장 실패");
      }
    });
  })(req, res, next);
  // next()
});

// 이 부분 플랜으로 작성하면 됨~
// router.post("/main", (req, res, next) => {
// });

router.get("/checkauth", isNotLoggedIn, function (req, res) {
  res.status(200).json({
    status: "Login successful!",
  });

  console.log(req.isAuthenticated());
});

// router.post('/main', (req, res, next) => {
//   console.log('Inside POST /login callback')
//   passport.authenticate('local', (err, user, info) => {
//     console.log('Inside passport.authenticate() callback');
//     // console.log(req.session.passport: ${JSON.stringify(req.session.passport)})
//     // console.log(req.user: ${JSON.stringify(req.user)})
//     req.login(user, (err) => {
//       console.log('Inside req.login() callback')
//       // console.log(req.session.passport: ${JSON.stringify(req.session.passport)})
//       // console.log(req.user: ${JSON.stringify(req.user)})
//       return res.send('You were authenticated & logged in!\n');
//     })
//   })(req, res, next);
// })

//@ localhost:3000/logout
router.get("/logout", (req, res) => {
  res.render("logout");
});

router.get("/logout", isNotLoggedIn, (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  console.log("로그아웃 되었습니다. ");
});

module.exports = router;

// res.render('alerts/logout', {
//   logout: '로그아웃 되었습니다.',
// });
