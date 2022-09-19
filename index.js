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

module.exports = fp(async function (fastify, opts = {}) {
  const { soa } = fastify
  await soa.get('knex')
  fastify.log.debug('auth opts=', opts)
}, { fastify: '4.x' })
