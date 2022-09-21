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
  const { soa, _, $, log } = fastify
  await soa.get('knex')
  const ojs = await soa.get('objection')
  const files = await $.glob(`${path.join(__dirname, 'src', 'models')}/**/*.js`)
  for (let i = 0; i < files.length; i++) {
    // console.log(`file ${i} = ${files[i]}`)
    try {
      const m = require(files[i])
      await m.setup(fastify, ojs)
    } catch (e) {
      log.error("加载Schema'%s'时发生错误:%s", files[i], e)
    }
  }
  if (_.isObject(fastify.runcmd)) { // runcmd mode.
    return await require('./src/cmds').run(fastify, opts)
  }
  fastify.log.debug('auth opts=', opts)
}, { fastify: '4.x' })
