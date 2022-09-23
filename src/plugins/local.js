/// //////////////////////////////////////////////////////////////////////////
//                                                                          //
//  本文件是WIDE2.0的组成部分.                                               //
//                                                                         //
//  WIDE website: http://www.wware.org/                                    //
//  WIDE website: http://www.prodvest.com/                                 //
//  License : WWARE LICENSE(https://www.wware.org/license.html)            //
/// /////////////////////////////////////////////////////////////////////////
// Created On : 22 Sep 2022 By 李竺唐 of SanPolo.Co.LTD
// File: local

const crypto = require('crypto')

module.exports = async function (fastify, passport, conf) {
  // console.log('passport.module.Strategy=', passport.module.Strategy)
  const { shell } = fastify
  const LocalStrategy = await shell.import('passport-local')
  // console.log('LocalStrategy=', LocalStrategy)
  passport.use('local', new LocalStrategy.Strategy(async function (username, password, done) {
    const { s, soa } = fastify
    const env = await soa.get('env')
    let colName = ''
    if (s.v.isIdentityCard(username, env.locale)) {
      colName = 'idcard'
    } else if (s.v.isEmail(username)) {
      colName = 'email'
    } else if (s.v.isMobilePhone(username, env.locale)) {
      colName = 'email'
    } else {
      colName = 'accountName'
    }

    let row = false
    if (colName) {
      const ojs = await soa.get('objection')
      const Users = ojs.Model.store.users
      const user = await Users.query()
        .select('id', 'accountName', 'password', 'avatar', 'role', 'group')
        .where(colName, username)
      if (user.length === 1) {
        if (user[0].password === crypto.createHash('md5').update(password).digest('hex')) {
          row = user[0]
          delete row.password
        }
      }
    }
    // console.log('local login=', username, passport)
    // const row = { username: 'test', role: ['a', 'b', 'c'] }
    done(null, row)
    // console.log('after cb!!row=', row)
  }))
  //
}
