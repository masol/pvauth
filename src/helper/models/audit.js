/// //////////////////////////////////////////////////////////////////////////
//                                                                          //
//  本文件是WIDE2.0的组成部分.                                               //
//                                                                         //
//  WIDE website: http://www.wware.org/                                    //
//  WIDE website: http://www.prodvest.com/                                 //
//  License : WWARE LICENSE(https://www.wware.org/license.html)            //
/// /////////////////////////////////////////////////////////////////////////
// Created On : 23 Sep 2022 By 李竺唐 of SanPolo.Co.LTD
// File: audit

const TABLENAME = 'audit'
module.exports.setup = async function (fastify, ojs) {
  class Audit extends ojs.Model {
    static get tableName () {
      return TABLENAME
    }
  }
  // console.log('ojs', ojs)
  ojs.Model.store[TABLENAME] = Audit
}
