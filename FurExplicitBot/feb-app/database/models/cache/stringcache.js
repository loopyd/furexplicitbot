/* eslint-disable no-undef */
const Sequelize = require('sequelize');

module.exports = sequelize.define(
    'stringcache',
    {
        ID: {
            type: Sequelize.STRING(32),
            allowNull: false,
            primaryKey: true,
        },
        sha256: {
            type: Sequelize.STRING(256),
            allowNull: false,
        },
        lang: {
            type: Sequelize.STRING(16),
            allowNull: false,
            // ISO 639-1 with macrolanguage code
            // See: https://support.deepl.com/hc/en-us/articles/360019925219-Languages-included-in-DeepL-Pro
            // 'uw-WU' is the uwuifier (custom language code) 
            isIn: [ 'uw-WU', 'bg-BG', 'en-US', 'zh-CN', 'ja-JP', 'cs-CZ', 'fr-FR', 'de-DE', 'ru-RU', 'da-DK', 'nl-NL', 'pt-PT', 'es-ES', 'it-IT', 'et-EE', 'sv-SE', 'pl-PL', 'nn-NO', 'fi-FI', 'el-GR', 'hi-IN', 'hu-HU', 'ko-KR', 'vi-VN', 'lv-LV', 'tr-TR', 'th-TH', 'sv-SE', 'lt-LT', 'id-ID', 'sk-SK', 'uk, UA' ],
        },
        value: {
            type: Sequelize.TEXT('long'),
            allowNull: false,
        }
    },
    {
        uniqueKeys: {
            stringcacheUnique: [ 'sha256', 'value'],
        },
    }
);