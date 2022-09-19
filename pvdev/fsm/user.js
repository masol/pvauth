/// //////////////////////////////////////////////////////////////////////////
//                                                                          //
//  本文件是WIDE2.0的组成部分.                                               //
//                                                                         //
//  WIDE website: http://www.wware.org/                                    //
//  WIDE website: http://www.prodvest.com/                                 //
//  License : WWARE LICENSE(https://www.wware.org/license.html)            //
/// /////////////////////////////////////////////////////////////////////////
// Created On : 19 Sep 2022 By 李竺唐 of SanPolo.Co.LTD
// File: login
import { createMachine } from 'xstate'

module.exports = ({ enabled }) => {
  /** @xstate-layout N4IgpgJg5mDOIC5QApDeboVX0CUA6QT7oYGJALm0ABUxUABwHtYBLAF1qoDtyQAPRAdgA5sAWAGwBGHgAYeAVik9BXfgE4ANCACeiYcMHYFAJn5iuk4QGYTp3QpMBfayrRZsgKnNCGNtTqMWbTgmFcTAXlRXWFdHgUxQV1JFXUEMVs7EGYqCDg2Bxx8dHcaBiZWJA5EQKj5HiFoyS5BQQi4xEVsSTN5XTMwnh4Tflt7DBwXXOKPAu9i32FjbEqxRUMFIyFGvy5dbHN+EwV+CJ5dMQUe-pAsvM9Cn0QAWkOdExjptv4O81WbrmEdBV+D6IMSxESWsQA */
  const machine = createMachine({
    initial: '已登录',
    id: '用户登录状态',
    states: {
      已登录: {
        on: {
          注销: {
            target: '未登录'
          }
        }
      },
      未登录: {
        on: {
          登录: {
            target: '已登录'
          }
        }
      }
    }
  })
  return machine
}
