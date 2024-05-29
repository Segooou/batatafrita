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
 * @property {array<string>} payload
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
 * @property {string} spreadsheetId
 * @property {string} email
 * @property {string} password
 * @property {string} sheetName
 * @property {string} resultColumn
 * @property {number} startRow
 * @property {number} endRow
 */

/**
 * @typedef {object} GoogleSheetsQuery
 * @property {string} email.query.required
 * @property {string} password.query.required
 * @property {string} sheetId.query.required
 * @property {string} sheetName.query.required
 * @property {string} resultColumn.query.required
 * @property {number} startRow.query.required
 * @property {number} endRow.query.required
 */
