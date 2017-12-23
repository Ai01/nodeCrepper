// TODO:bai 代码重构
const https = require('https');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { getTargetDoubanMovieUrl } = require('./targetUrl/getDoubanMovieUrl');
const { createMovies } = require('./models/movies/createMovie');

// 保存数据到数据库
const saveData = (path, movies) => {
  if (Array.isArray(movies)) {
    movies.forEach((e)=>{
      createMovies(e);
    })
  }
};

// 解析html
const analysis = htmlCode => {
  const movies = []; // 保存从html中解析出来的电影数据
  const $ = cheerio.load(htmlCode);
  $('.item').each(function() {
    const movie = {
      title: $('.title', this).text(),
      start: $('.star .rating_num', this).text(),
      link: $('a', this).attr('href'),
      picUrl: $('.pic img', this).attr('src'),
    };
    movies.push(movie);
  });
  return movies;
};

// 一次抓取过程
const spider = targetUrl => {
  https
    .get(targetUrl, res => {
      let html = ''; // 保存抓取到的html
      res.setEncoding('utf8');
      res.on('data', chunk => {
        html += chunk;
      });
      res.on('end', () => {
        const allMovies = analysis(html);
        saveData(path.resolve(__dirname + '/../data/data.json'), allMovies);
      });
    })
    .on('error', err => {
      console.log(err);
    });
};

for (let i = 0; i < 10; i += 1) {
  spider(getTargetDoubanMovieUrl(i));
}
