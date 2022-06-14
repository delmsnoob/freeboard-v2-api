const Promise = require('bluebird')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))
const SECRET_KEY = process.env.APP_KEY || 'nosecret'

const Setting = require('@store/setting')

const jwtModule = {
  async getTokenExpiry () {
    const sessionDefaults = await Setting.getDeepSetting({
      name: 'session_default',
      key: ['duration', 'type']
    })

    console.log(sessionDefaults, 'session default')

    if (!sessionDefaults || !sessionDefaults.setting) {
      throw new Error('No session defaults found!')
    }

    return JSON.parse(sessionDefaults.setting)
  },

  /**
 * Sign asynchronously, wrapped in native promise
 *
 * @param  {String} payload           Payload to sign
 * @return {Promise}
 */

  async sign (payload) {
    try {
      const sessionDefaults = await jwtModule.getTokenExpiry()

      const expiresIn = sessionDefaults.join('')

      return jwt.signAsync(payload, SECRET_KEY, { expiresIn })
    } catch (error) {
      throw new Error(error)
    }
  },

  /**
   * Verify asynchronously, wrapped in native promise
   *
   * @param  {String} token             JWT to verify
   * @return {Promise}
   */

  async verify (token) {
    try {
      const sessionDefaults = await jwtModule.getTokenExpiry()
      const expiresIn = sessionDefaults.join('')

      return jwt.verifyAsync(token, SECRET_KEY, { expiresIn })
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = jwtModule
// const secret = 'lnu-archiving-system'
// const Promise = require('bluebird')
// const jwt = Promise.promisifyAll(require('jsonwebtoken'))

// module.exports = {
//   sign (payload) {
//     return jwt.signAsync({ data: payload }, secret)
//   },

//   verify (token) {
//     return jwt.verifyAsync(token, secret)
//   }
// }
