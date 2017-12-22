const baseDoubanMovieUrl = {
  hostname: 'movie.douban.com',
  path: '/top250',
  port: 443,
};

const getTargetDoubanMovieUrl = (page,pageSize = 25) => {
  return {
    ...baseDoubanMovieUrl,
    path: `/top250?start=${pageSize * page}`
  }
}


module.exports = {
  getTargetDoubanMovieUrl,
}
