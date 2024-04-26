const Joi = require("joi");


module.exports.blogSchema = Joi.object({
    blog: Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        image: Joi.string().allow("", null),
    }).required(),
})
