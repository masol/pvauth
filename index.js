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
  const { soa, _, util, config } = fastify
  const cfgutil = config.util
  await soa.get('knex')
  await util.model(path.join(__dirname, 'src', 'helper', 'models'))
  if (_.isObject(fastify.runcmd)) { // runcmd mode.
    return await require('./src/cmds').run(fastify, opts)
  } else {
    const passport = await soa.get('passport')
    const strategies = cfgutil.has('passport.strategies') ? cfgutil.get('passport.strategies') : {}
    // 注册local验证。
    await require('./src/plugins/local')(fastify, passport, strategies.local || {})
    await util.schema(path.join(__dirname, 'src', 'helper', 'schemas'))
    await util.route(path.join(__dirname, 'src', 'routes'))
    // @TODO: 如果是dev模式，注册静态地址。
    // if (cfgutil.isDev()) {
    // }
  }
  fastify.log.debug('auth opts=', opts)
}, { fastify: '4.x' })
