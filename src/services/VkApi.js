const axios = require("axios");
const qs = require("querystring");

function proxiedRequest(url) {
  return axios.post("https://node-deploy-alex.herokuapp.com/cors/", {
    url
  });
}

const clientId = process.env.VK_APP_ID;
const clientSecret = process.env.VK_SECRET_KEY;

class VkApi {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async getInfo() {
    const { data } = await this.makeApiRequest("users.get", { fields: "photo_100"});
    return data;
  }

  async getFriends() {
    const { data } = await this.makeApiRequest("friends.get", { fields: "photo_100"});
    return data;
  }

  async getFriendsInApp() {
    const { status, data } = await this.makeApiRequest("friends.getAppUsers");
    return [status, data];
  }

  makeApiRequest(method, query = {}) {
    const endpoint = this.apiEndpoint(method, query);
    return process.env.NODE_ENV === "production" ? axios.get(endpoint) : proxiedRequest(endpoint);
  }

  apiEndpoint(method, query) {
    query["access_token"] = this.accessToken;
    query["v"] = VkApi.version;
    return `https://api.vk.com/method/${method}?${qs.encode(query)}`;
  }

  static get version() {
    return "5.52";
  }

  static getRedirect(id) {
    return `https://insanity-game-backend.herokuapp.com/auth/${id}`;
  }

  static getAuth() {
    // todo: change timestamp to random string?
    const id = Date.now();
    return {
      url: `https://oauth.vk.com/authorize?client_id=${clientId}&display=page&redirect_uri=${VkApi.getRedirect(id)}&scope=friends&response_type=code&v=${VkApi.version}`,
      id
    }
  }

  static getAccessToken(code, id) {
    const url = `https://oauth.vk.com/access_token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${VkApi.getRedirect(id)}&code=${code}`;
    return axios.get(url);
  }

  static async isUserAcessTokenValid(accessToken) {
    const { data } = axios.get(`https://api.vk.com/method/users.get?fields=photo_100&access_token=${accessToken}&v=${VkApi.version}`);
    return data.response !== null;
  }
}

module.exports = VkApi;