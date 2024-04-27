const Joi = require("joi");


module.exports.blogSchema = Joi.object({
    blog: Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        image: Joi.string().allow("", null),
    }).required(),
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment : Joi.string().required(),
        rating : Joi.string().required().min(1).max(5),
    }).required(),
});
