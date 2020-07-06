const router = require('koa-router')()
const request = require('request')
// const db = require('../modules/db')
const ticket = require('../modules/netbake')
const format = require('date-format')
const netbake = require('../modules/netbake')

/**
 * 一网烘焙接口请求 路由
 */
router.post('postinfoupdate', async (ctx, next) => {
    
    let params = ctx.request.body

    let url = ctx.request.url

    let res = await netbake._req(url, params)


    ctx.response.body = {
        code: 200,
        msg: 'ok',
        data: {
            result: res
        }
    }
    next()
})

router.post('postinfoquery', async (ctx, next) => {
    
    let params = ctx.request.body

    let url = ctx.request.url

    let res = await netbake._req(url, params)

    ctx.response.body = {
        code: 200,
        msg: 'ok',
        data: {
            result: res
        }
    }
    next()
})


// /**
//  * 获取小程序openid
//  */
// router.post('getopenid', async (ctx, next) => {
//     const appid = 'wxf67ad75a5a51260d',
//         secret = '068cffe203921ca62109c4e889adeda6',
//         js_code = ctx.request.body.js_code.code,
//         grant_type = 'authorization_code',
//         url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${js_code}&grant_type=${grant_type}`;

//     /**
//      * 给TX发出请求 请求openid
//      */
//     let getTencentID = () => {
//         return new Promise((resolve, reject) => {
//             request(url, (err, res) => {
//                 if (!err && res.statusCode === 200) {
//                     resolve(res);
//                 } else {
//                     reject(err);
//                 }
//             })
//         })
//     }

//     /**
//      * await同步 等待请求完成返回给客户端
//      */
//     await getTencentID()
//         .then(
//             (data) => {
//                 let bodyObj = JSON.parse(data.body);
//                 ctx.response.body = {
//                     code: 200,
//                     msg: 'ok',
//                     data: { openid: bodyObj.openid }
//                 }
//             }
//         )
//         .catch(
//             (err) => {
//                 ctx.response.body = {
//                     code: 401,
//                     msg: 'error',
//                     data: err
//                 }
//             }
//         )

//     next()
// })


// //  查询是否存在用户
// router.get('queryuser', async (ctx, next) => {
//     let openid = ctx.query.openid
//     let res = await db.query(`select nickname, gender, city, openid, chances, isLogin from t_user where openid = '${openid}'`)
//     ctx.response.body = {
//         code: 200,
//         msg: 'ok',
//         data: {
//             result: res
//         }
//     }
//     next()
// })

// //  插入微信用户
// router.post('adduser', async (ctx, next) => {
//     let params = ctx.request.body
//     let nickname = params.nickname
//     let gender = params.gender
//     let city = params.city
//     let chances = params.chances
//     let isLogin = params.isLogin
//     let openid = params.openid

//     let res = await db._operation(`insert into t_user values (default, '${nickname}', ${gender}, '${city}', '${openid}', ${chances}, ${isLogin})`)

//     ctx.response.body = {
//         code: 200,
//         msg: 'ok',
//         data: {
//             result: res
//         }
//     }

//     next()
// })

// //  更新个人抽奖次数
// router.post('updatechances', async (ctx, next) => {
//     let params = ctx.request.body
//     let chances = params.chances
//     let openid = params.openid

//     let res = await db._operation(`update t_user set chances = ${chances} where openid = '${openid}'`)

//     ctx.response.body = {
//         code: 200,
//         msg: 'ok',
//         data: {
//             result: res
//         }
//     }
//     next()
// })

// //  添加抽奖记录
// router.post('addrecord', async (ctx, next) => {
//     let params = ctx.request.body,
//         openid = params.openid,
//         productid = params.productid ? params.productid : null,
//         drawTime = format('yyyy-MM-dd hh:mm:ss', new Date()),
//         ticketno = params.ticketno ? params.ticketno : null,
//         ticketcode = params.ticketcode ? params.ticketcode : null,
//         startdate = params.startdate ? params.startdate : null,
//         enddate = params.enddate ? params.enddate : null;

//     //  根据openid 查询出user uid
//     let userResults = await db._operation(`select uid from t_user where openid = '${openid}'`)
//     let uid = userResults[0].uid

//     //  根据productid 查询出 ticket tid
//     let ticketResults = await db._operation(`select tid from t_ticket where productid = ${productid}`)

//     //  判断是否中奖 执行不同的sql语句
//     let res
//     if (ticketResults.length) {
//         //中奖  插入抽奖记录
//         let tid = ticketResults[0].tid
//         res = await db._operation(`insert into t_record values (default, ${uid}, ${tid}, '${ticketno}', '${ticketcode}', '${startdate}', '${enddate}', '${drawTime}')`)

//     } else {
//         //  未中奖 插入空中奖记录
//         res = await db._operation(`insert into t_record values (default, ${uid}, null, null, null, null, null, '${drawTime}')`)
//     }

//     ctx.response.body = {
//         code: 200,
//         msg: 'ok',
//         data: {
//             result: res
//         }
//     }
//     next()

// })

// //  生成优惠券
// router.post('ticketgen', async (ctx, next) => {
//     let params = ctx.request.body,
//         openid = params.openid,
//         productid = params.productid,
//         startdate = params.startdate,
//         enddate = params.enddate;

//     let res = await ticket.gen(productid, startdate, enddate, openid)

//     ctx.response.body = {
//         code: 200,
//         msg: 'ok',
//         data: {
//             result: res
//         }
//     }
//     next()
// })

// //  查询优惠券
// router.post('ticketquery', async (ctx, next) => {
//     let params = ctx.request.body,
//         ticketcode = params.ticketcode;

//     let res = await ticket.query(ticketcode)

//     ctx.response.body = {
//         code: 200,
//         msg: 'ok',
//         data: {
//             result: res
//         }
//     }
//     next()
// })

// //  获取中奖记录通知
// router.get('getwinners', async(ctx, next) => {

//     let res = await db._operation(`select u.nickname, t.productname from t_record r
//                                     left join t_user u 
//                                     on r.uid = u.uid
//                                     left join t_ticket t
//                                     on t.tid = r.tid
//                                     where r.tid is not null 
// 									order by r.rid desc
// 									limit 30`)
//     ctx.response.body = {
//         code: 200,
//         msg: 'ok',
//         data: {
//             result: res
//         }
//     }
//     next()
// })

// //  查询个人中奖记录
// router.get('awardrecords', async(ctx, next) => {
//     let openid = ctx.request.query.openid

//     let userResults = await db._operation(`select uid from t_user where openid = '${openid}'`)

//     let uid = userResults[0].uid

//     let res = await db._operation(`select t.productname, t.price, r.ticketcode, r.ticketno from t_record r
//                                     left join t_ticket t
//                                     on r.tid = t.tid
//                                     left join t_user u
//                                     on r.uid = u.uid
//                                     where r.uid = ${uid} and r.tid is not null`)

//     ctx.response.body = {
//         code: 200,
//         msg: 'ok',
//         data: {
//             result: res
//         }
//     }
//     next()
// })

module.exports = router.routes()