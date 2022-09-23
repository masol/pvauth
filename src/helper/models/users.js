/// //////////////////////////////////////////////////////////////////////////
//                                                                          //
//  本文件是WIDE2.0的组成部分.                                               //
//                                                                         //
//  WIDE website: http://www.wware.org/                                    //
//  WIDE website: http://www.prodvest.com/                                 //
//  License : WWARE LICENSE(https://www.wware.org/license.html)            //
/// /////////////////////////////////////////////////////////////////////////
// Created On : 21 Sep 2022 By 李竺唐 of SanPolo.Co.LTD
// File: user

const TABLENAME = 'users'
module.exports.setup = async function (fastify, ojs) {
  // console.log('123')
  const { _ } = fastify
  class Users extends ojs.Model {
    static get tableName () {
      return TABLENAME
    }

    // @TODO: 需要自动创建及更新schem。以验证数据内容。
    // static get jsonSchema() {}

    $parseDatabaseJson (json) {
      // Remember to call the super class's implementation.
      json = super.$parseDatabaseJson(json)
      // 将role,group默认值改为数组。
      json.role = json.role || []
      json.group = json.group || []
      return json
    }

    $formatDatabaseJson (json) {
      // Remember to call the super class's implementation.
      json = super.$formatDatabaseJson(json)
      // 删除role/group.如果是默认值。
      if (_.isArray(json.role) && json.role.length === 0) delete json.role
      if (_.isArray(json.group) && json.group.length === 0) delete json.group
      return json
    }
  }
  // console.log('ojs', ojs)
  ojs.Model.store[TABLENAME] = Users
}
