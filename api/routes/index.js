const router = require('koa-router')()
const request = require('request')
const ticket = require('../modules/netbake')
const format = require('date-format')
const netbake = require('../modules/netbake')


/**
 * 一网烘焙更新邮寄信息请求
 */
router.post('postinfoupdate', async (ctx, next) => {

    let params = ctx.request.params

    let url = ctx.request.url

    try {

        let res = await netbake._req(url, params, 'post')

        ctx.response.body = {
            code: 200,
            msg: 'ok',
            data: {
                result: res
            }
        }

    } catch (error) {

        ctx.response.body = {
            code: 400,
            msg: 'error',
            data: {
                result: error
            }
        }
    }

    next()
})

/**
 * 一网烘焙查询邮寄信息请求
 */
router.get('postinfoquery', async (ctx, next) => {

    let params = ctx.request.params

    let url = ctx.request.url

    try {

        let res = await netbake._req(url, params)

        ctx.response.body = {
            code: 200,
            msg: 'ok',
            data: {
                result: res
            }
        }

    } catch (error) {

        ctx.response.body = {
            code: 400,
            msg: 'error',
            data: {
                result: error
            }
        }
    }

    next()
})

module.exports = router.routes()