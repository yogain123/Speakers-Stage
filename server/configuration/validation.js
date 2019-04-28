const Joi = require('joi');

let joiValidation = function (reqData, schema) {

    const userSchema = Joi.object().keys({
        email: Joi.string().email().required(),
        age: Joi.number().required(),
        gender: Joi.string().required(),
        password: Joi.string().required()
    });

    const postSchema = Joi.object().keys({
        post: Joi.string().required(),
        email: Joi.string().email().required()
    });

    const loginSchema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const followUserSchema = Joi.object().keys({
        otherEmail: Joi.string().email().required(),
        email: Joi.string().email().required()
    });

    const checkFollowingSchema = Joi.object().keys({
        postId: Joi.string().required(),
        email: Joi.string().email().required()
    });

    switch (schema) {
        case "userSchema":
            schema = userSchema;
            break;
        case "loginSchema":
            schema = loginSchema;
            break;
        case "postSchema":
            schema = postSchema;
            break;
        case "followUserSchema":
            schema = followUserSchema;
            break;
        case "checkFollowingSchema":
            schema = checkFollowingSchema;
            break;
        default:
            break;
    }

    let result = Joi.validate(reqData, schema);
    return result.error;

}

module.exports = {
    joiValidation,
};