const store = require('@store')
const { raw } = require('@utilities/knex-helper')

module.exports = {
  getDeepSetting ({ name, key }) {
    const keys = Array.isArray(key)
      ? key.map(x => `'$.${x}'`).join(',')
      : `'$.${key}`

    return store.knex('setting_default')
      .where('setting_name', name)
      .select({
        setting: raw(`JSON_UNQUOTE(JSON_EXTRACT(setting_json, ${keys}))`)
      })
      .first()
  }
}
