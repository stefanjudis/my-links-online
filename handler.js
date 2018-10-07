'use strict';

const got = require('got');

module.exports.redirect = async ({ pathParameters }, context) => {
  try {
    const { shortUrl } = pathParameters;
    const queryUrl = `https://cdn.contentful.com/spaces/${
      process.env.SPACE_ID
    }/environments/master/entries?content_type=${
      process.env.CONTENT_TYPE
    }&fields.shortUrl=${shortUrl}&access_token=${process.env.ACCESS_TOKEN}`;

    const response = JSON.parse((await got(queryUrl)).body);
    const redirect = response.items[0];

    if (!redirect) {
      throw new Error('Redirect not found');
    }

    return {
      statusCode: 301,
      headers: {
        Location: redirect.fields.targetUrl
      }
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: e.message
    };
  }
};
