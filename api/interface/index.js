const axios = require('../api.request');

const getRepos = params => {
    return axios.request({
        url: 'https://api.github.com/users/yuuuuuyu/repos',
        params,
        method: 'get'
    })
}

module.exports = {
    getRepos
}
