/// //////////////////////////////////////////////////////////////////////////
//                                                                          //
//  本文件是WIDE2.0的组成部分.                                               //
//                                                                         //
//  WIDE website: http://www.wware.org/                                    //
//  WIDE website: http://www.prodvest.com/                                 //
//  License : WWARE LICENSE(https://www.wware.org/license.html)            //
/// /////////////////////////////////////////////////////////////////////////
// Created On : 22 Sep 2022 By 李竺唐 of SanPolo.Co.LTD
// File: login

'use strict'

module.exports = async function (fastify, opts) {
  const { soa, error, config, util, _ } = fastify
  const cfgutil = config.util
  const passport = await soa.get('passport')
  fastify.post('/v1/auth/login',
    {
      schema: {
        body: {
          $ref: '/v1/auth/login#'
        }
      }
    },
    async function (request, reply) {
      // console.log('before handler', request.body)
      if (request.isAuthenticated()) {
        throw new error.PreconditionRequiredError('Already logined')
      }
      //, { successRedirect: '/' , failureRedirect: '/login'}
      const Handler = await passport.authenticate('local')
      await Handler(request, reply)
      const auditCfg = cfgutil.has('passport.audit') ? cfgutil.get('passport.audit') : {}
      if (!auditCfg.disabled) {
        // 添加审计信息。
        const ojs = await soa.get('objection')
        const Audit = ojs.Model.store.audit
        const ipfs = _.drop(util.forwarded(request))
        const auditJSON = {
          action: 'login',
          suc: false,
          username: request.body.username,
          ip: request.ip,
          ipfs
        }
        console.log('request.session=', request.session)
        if (request.isAuthenticated()) {
          auditJSON.suc = true
          auditJSON.uid = request.user.id
          auditJSON.sid = request.session.sessionId
        } else {
          auditJSON.password = request.body.password
        }
        await Audit.query().insert(auditJSON)
      }
      if (request.isAuthenticated()) {
        if (request.body.keep) {
          // 或者使用reply.setcooke?
          const maxDayAge = cfgutil.has('passport.local.keep') ? parseInt(cfgutil.get('passport.local.keep')) : 365
          const maxAge = maxDayAge * 24 * 60 * 60 * 1000
          request.session.maxAge = maxAge
          request.session.expires = new Date(Date.now() + maxAge)
          request.session.cookie.expires = request.session.expires
          // request.session.regenerate()
          // console.log('request.session=', request.session)
        }
        return request.user
      }
      // return {
      //   ok: false
      // }
      // console.log('after handler')
    })

  fastify.put('/v1/auth/logout',
    async function (request, reply) {
      // console.log('before handler', request.body)
      if (!request.isAuthenticated()) {
        throw new error.PreconditionRequiredError('not logined')
      }
      await request.logout()
      return {
        ok: true
      }
    }
  )
}
