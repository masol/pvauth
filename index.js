/// //////////////////////////////////////////////////////////////////////////
//                                                                          //
//  本文件是WIDE2.0的组成部分.                                               //
//                                                                         //
//  WIDE website: http://www.wware.org/                                    //
//  WIDE website: http://www.prodvest.com/                                 //
//  License : WWARE LICENSE(https://www.wware.org/license.html)            //
/// /////////////////////////////////////////////////////////////////////////
// Created On : 19 Sep 2022 By 李竺唐 of SanPolo.Co.LTD
// File: index
'use strict'
const fp = require('fastify-plugin')
const path = require('path')

module.exports = fp(async function (fastify, opts = {}) {
  const { soa, _, config } = fastify
  const cfgutil = config.util
  await soa.get('knex')
  await soa.model(path.join(__dirname, 'src', 'helper', 'models'))
  if (_.isObject(fastify.runcmd)) { // runcmd mode.
    return await require('./src/cmds').run(fastify, opts)
  } else {
    const passport = await soa.get('passport')
    const cfg = cfgutil.has('passport.conf') ? cfgutil.get('passport.conf') : {}
    // 注册local验证。
    await require('./src/plugins/local')(fastify, passport, cfg.local || {})
    await soa.schema(path.join(__dirname, 'src', 'helper', 'schemas'))
    // @TODO: 如果是dev模式，注册静态地址。
    await soa.route(path.join(__dirname, 'src', 'routes'))
  }
  fastify.log.debug('auth opts=', opts)
}, { fastify: '4.x' })
