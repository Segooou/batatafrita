/**
 * @typedef {object} Messages
 * @property {string} english
 * @property {string} portuguese
 */

/**
 * @typedef {object} Errors
 * @property {Messages} message
 * @property {string} param
 */

/**
 * @typedef {object} DefaultResponse
 * @property {Messages} message
 * @property {string} status
 * @property {string} payload
 */

/**
 * @typedef {object} BadRequest
 * @property {array<Errors>} errors
 * @property {Messages} message
 * @property {string} status
 */

/**
 * @typedef {object} UnauthorizedRequest
 * @property {array<Errors>} errors
 * @property {Messages} message
 * @property {string} status
 */

/**
 * @typedef {object} NotFoundRequest
 * @property {array<Errors>} errors
 * @property {Messages} message
 * @property {string} status
 */

/**
 * @typedef {object} ForbiddenRequest
 * @property {array<Errors>} errors
 * @property {Messages} message
 * @property {string} status
 */

/**
 * @typedef {object} GoogleSheets
 * @property {string} sheetId
 * @property {string} email
 * @property {string} password
 * @property {string} sheetName
 * @property {string} resultColumn
 * @property {number} startRow
 * @property {number} endRow
 */
