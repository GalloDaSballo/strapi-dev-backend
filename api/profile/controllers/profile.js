const { sanitizeEntity } = require('strapi-utils');

/**
 * Hide fields
 * @param {*} entity 
 */
const hideFields = (entity) => {
  entity.name = "Name"
  entity.location = "Location"
  entity.preferred_salary = "Salary"
  entity.hasPaid = false,
  entity.github = "Github"
  entity.linkedin = "Linkedin"
}

/**
 * Remove dangerous data
 * @param {*} entity 
 */
const sanitize = (entity) => {
  delete entity.user
}

module.exports = {
  /**
   * Retrieve records.
   * Cleaned up for privacy + sales
   * 
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.profile.search(ctx.query, ["skills"]);
    } else {
      entities = await strapi.services.profile.find(ctx.query, ["skills"]);
    }

    //Check if users has paid to see info about devs
    entities.forEach(entity => {
      hideFields(entity)
    })

    // Sanitize
    entities.forEach(entity => sanitize(entity))


    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.profile }));
  },
  /**
   * Retrieve a record.
   * Cleaned up for privacy + sales
   *
   * @return {Object}
   */

  async findMine(ctx) {
    const { user } = ctx.state
    const entity = await strapi.services.profile.findOne({ id: user.profile.id });

    // Sanitize just because
    sanitize(entity)

    return sanitizeEntity(entity, { model: strapi.models.profile });
  },
    /**
   * Retrieve a record.
   * Cleaned up for privacy + sales
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.profile.findOne({ id }, ["skills"]);

    // Clean up
    hideFields(entity)
    sanitize(entity)

    return sanitizeEntity(entity, { model: strapi.models.profile });
  },

  /**
   * Update your record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.profile.update({ id }, {...data, user: user.id}, {
        files,
      });
    } else {
      entity = await strapi.services.profile.update({ id }, {...ctx.request.body, user: user.id});
    }

    return sanitizeEntity(entity, { model: strapi.models.profile });
  },
};