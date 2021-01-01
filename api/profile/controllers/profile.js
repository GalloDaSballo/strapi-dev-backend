const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.profile.search(ctx.query);
    } else {
      entities = await strapi.services.profile.find(ctx.query);
    }

    //Check if users has paid to see info about devs
    entities.map(entity => {
        entity.name = "Name"
        entity.location = "Location"
        entity.preferred_salary = "Salary"
        entity.hasPaid = false,
        entity.github = "Github"
        entity.linkedin = "Linkedin"
    })

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.profile }));
  },
};