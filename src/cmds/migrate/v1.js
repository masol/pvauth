/// //////////////////////////////////////////////////////////////////////////
//                                                                          //
//  本文件是WIDE2.0的组成部分.                                               //
//                                                                         //
//  WIDE website: http://www.wware.org/                                    //
//  WIDE website: http://www.prodvest.com/                                 //
//  License : WWARE LICENSE(https://www.wware.org/license.html)            //
/// /////////////////////////////////////////////////////////////////////////
// Created On : 20 Sep 2022 By 李竺唐 of SanPolo.Co.LTD
// File: v1

const USER = 'users'
// const OAUTH = 'oauth'
// const AUTH = 'auth'
module.exports = function (fastify, opts) {
  return {
    async up (knex) {
      // await knex.raw('CREATE SCHEMA IF NOT EXISTS ??', AUTH)
      // return knex.schema.withSchema(AUTH)
      return knex.schema
        .createTable(USER, function (table) {
          table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('gen_random_uuid()'))
          // 帐号名，可空。
          table.string('accountName', 128).unique().nullable()
          // 密码md5。
          table.string('password', 128).nullable()
          // 昵称
          table.string('nickName', 128).nullable()
          // 显示用真实名
          table.string('commonName', 32).nullable()
          // 邮箱地址
          table.string('email', 128).unique().nullable()
          // 邮箱地址已验证。
          table.boolean('emailVerified').defaultTo(false)
          // 手机号码
          table.string('mobile', 32).unique().nullable()
          // 手机号码已验证。
          table.boolean('mobileVerified').defaultTo(false)
          // 电话号码
          table.string('phone', 32).unique().nullable()
          // 电话号码已验证。
          table.boolean('phoneVerified').defaultTo(false)
          // 真实姓名
          table.string('name', 32).nullable()
          // 真实姓名已验证(身份证验证)
          table.boolean('nameVerified').defaultTo(false)
          // 身份证号
          table.string('idcard', 64).unique().nullable()
          // 身份证号已验证(身份证验证)
          table.boolean('idcardVerified').defaultTo(false)
          // 是否激活
          table.boolean('inactive').defaultTo(false)
          // 创建日期。
          table.timestamp('created').notNullable().defaultTo(knex.fn.now())
          // 创建人
          table.uuid('createdBy').nullable()
          // avatar(URL)
          table.text('avatar').nullable()
          // 用户备注
          table.text('note').nullable()
          // 逗号分割的下一动作序列。
          table.string('action', 255).nullable()
          // 所属角色,采用数字数组。
          table.specificType('role', 'integer ARRAY').nullable()
          // 所属组数组,采用数字数组。
          table.specificType('group', 'integer ARRAY').nullable()

          table.foreign('createdBy').references(`${USER}.id`)
        })
    },
    async down (knex) {
      const { log, runcmd, _ } = fastify
      // const schema = await knex.schema.withSchema(AUTH)
      // const exist = await schema.hasTable(USER)
      const exist = await knex.schema.hasTable(USER)
      if (exist) {
        if (!runcmd.force) {
          const countInfo = await knex.table(USER).count()
          const count = (_.isArray(countInfo) && countInfo.length > 0) ? countInfo[0].count : 0
          // console.log('count=', count)
          if (count > 0) {
            console.log('error!!!')
            const msg = `${USER}表中有${count}条数据，请添加-- --force参数来强制删除表格。`
            log.error(msg)
            throw new fastify.error.ServiceUnavailableError(msg)
          }
        }
        await knex.schema.dropTable(USER)
      }
    }
  }
}
