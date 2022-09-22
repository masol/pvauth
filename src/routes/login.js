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
  const { soa, error } = fastify
  const passport = await soa.get('passport')
  console.log('auth login route')
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
      if (request.isAuthenticated()) {
        return request.user
      }
      // console.log('after handler')
    }
  )

  fastify.put('/v1/auth/logout',
    async function (request, reply) {
    // console.log('before handler', request.body)
      if (!request.isAuthenticated()) {
        throw new error.PreconditionRequiredError('Already logined')
      }
      await request.logout()
      return {
        ok: true
      }
    }
  )
}
