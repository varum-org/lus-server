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
 *      '500':
 *        description: A failure response!
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
 *      '500':
 *        description: A failure response!
 */

/**
 * @swagger
 * /api/v1/user/verify_email:
 *  post:
 *    description: Verify email to register
 *    parameters:
 *      - in: body
 *        name: user
 *        description: Verify email to register
 *        schema:
 *          type: object
 *          required:
 *            - email
 *          properties:
 *            email:
 *              type: string
 *    responses:
 *      '200':
 *        description: A successful response!
 *      '500':
 *        description: A failure response!
 */

/**
 * @swagger
 * /api/v1/user/information:
 *  post:
 *    description: Get user information
 *    parameters:
 *      - in: body
 *        name: user
 *        description: Verify email to register
 *        schema:
 *          type: object
 *          required:
 *            - id
 *          properties:
 *            id:
 *              type: string
 *      - in: header
 *        name: authorization
 *        type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response!
 *      '404':
 *        description: No token provided!
 *      '500':
 *        description: A Failure response!
 */

/**
 * @swagger
 * /api/v1/message/loadAllRoom:
 *  post:
 *    description: Load all room chat
 *    parameters:
 *      - in: body
 *        name: Message
 *        description: Load all room chat
 *        schema:
 *          type: object
 *          required:
 *            - userId
 *          properties:
 *            userId:
 *              type: string
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response!
 *      '404':
 *        description: No token provided!
 *      '500':
 *        description: A Failure response!
 */

/**
 * @swagger
 * /api/v1/message/checkRoomAvailable:
 *  post:
 *    description: Check room chat
 *    parameters:
 *      - in: body
 *        name: Message
 *        description: Check room chat
 *        schema:
 *          type: object
 *          required:
 *            - userIdSend
 *            - userIdReceive
 *          properties:
 *            userIdSend:
 *              type: string
 *            userIdReceive:
 *              type: string
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response!
 *      '404':
 *        description: No token provided!
 *      '500':
 *        description: A Failure response!
 */

/**
 * @swagger
 * /api/v1/message/createRoom:
 *  post:
 *    description: Create room chat
 *    parameters:
 *      - in: body
 *        name: Message
 *        description: Create room chat
 *        schema:
 *          type: object
 *          required:
 *            - userIdSend
 *            - userIdReceive
 *          properties:
 *            userIdSend:
 *              type: string
 *            userIdReceive:
 *              type: string
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response!
 *      '404':
 *        description: No token provided!
 */

/**
 * @swagger
 * /api/v1/message/detail:
 *  post:
 *    description: Message detail for room chat
 *    parameters:
 *      - in: body
 *        name: Message
 *        description: Message detail for room chat
 *        schema:
 *          type: object
 *          required:
 *            - roomId
 *          properties:
 *            roomId:
 *              type: string
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response!
 *      '404':
 *        description: No token provided!
 */

/**
 * @swagger
 * /api/v1/idol/register:
 *  post:
 *    description: Register Idol
 *    parameters:
 *      - in: body
 *        name: Idol
 *        description: Register Idol
 *        schema:
 *          type: object
 *          required:
 *            - user_id
 *            - nick_name
 *            - address
 *            - relationship
 *            - description
 *            - image_gallery
 *          properties:
 *            user_id:
 *              type: string
 *            nick_name:
 *              type: string
 *            address:
 *              type: string
 *            relationship:
 *              type: string
 *            description:
 *              type: string
 *            image_gallery:
 *              type: array
 *              items:
 *                type: string
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response!
 *      '404':
 *        description: No token provided!
 */

/**
 * @swagger
 * /api/v1/idol/update:
 *  post:
 *    description: Update Idol information
 *    parameters:
 *      - in: body
 *        name: Idol
 *        description: Update Idol information
 *        schema:
 *          type: object
 *          required:
 *            - user_id
 *            - nick_name
 *            - address
 *            - relationship
 *            - description
 *            - image_gallery
 *          properties:
 *            user_id:
 *              type: string
 *            nick_name:
 *              type: string
 *            address:
 *              type: string
 *            relationship:
 *              type: string
 *            description:
 *              type: string
 *            image_gallery:
 *              type: array
 *              items:
 *                type: string
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response!
 *      '404':
 *        description: No token provided!
 */

/**
 * @swagger
 * /api/v1/cart/list:
 *  post:
 *    description: List Cart
 *    parameters:
 *      - in: body
 *        name: Cart
 *        description: List Cart
 *        schema:
 *          type: object
 *          required:
 *            - user_id
 *          properties:
 *            user_id:
 *              type: string
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response!
 *      '404':
 *        description: No token provided!
 */

/**
 * @swagger
 * /api/v1/cart/add:
 *  post:
 *    description: Add Idol to Cart
 *    parameters:
 *      - in: body
 *        name: Cart
 *        description: Add Idol to Cart
 *        schema:
 *          type: object
 *          required:
 *            - user_id
 *            - idol_id
 *          properties:
 *            user_id:
 *              type: string
 *            idol_id:
 *              type: string
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response!
 *      '404':
 *        description: No token provided!
 *      '500':
 *        description: Idol not available!
 */

/**
 * @swagger
 * /api/v1/cart/delete:
 *  post:
 *    description: Delete Idol from Cart
 *    parameters:
 *      - in: body
 *        name: Cart
 *        description: Delete Idol from Cart
 *        schema:
 *          type: object
 *          required:
 *            - user_id
 *            - idol_id
 *          properties:
 *            user_id:
 *              type: string
 *            idol_id:
 *              type: string
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response!
 *      '404':
 *        description: No token provided!
 *      '500':
 *        description: Idol not available!
 */
