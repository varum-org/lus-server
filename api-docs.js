/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *    description: Use to login
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to login
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      '200':
 *        description: A successful response!
 */

/**
 * @swagger
 * /api/v1/user/register:
 *  post:
 *    description: Use to Register
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to create
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *            - user_name
 *            - phone
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *            user_name:
 *              type: string
 *            phone:
 *              type: number
 *    responses:
 *      '200':
 *        description: A successful response!
 */
