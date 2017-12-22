const https = require('https');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { getTargetDoubanMovieUrl } = require('./targetUrl/getDoubanMovieUrl');

// 保存数据到本地
const saveData = (path, movies) => {
  if (Array.isArray(movies)) {
    movies.forEach(e => {
      fs.appendFile(path, JSON.stringify(e, null, 4), err => {
        if (err) {
          console.log(err);
          return null;
        }
      });
    });
    console.log('data saved success');
  }
};

//下载图片
const downloadImg = (imgDir, url) => {
  https
    .get(url, res => {
      let data = '';
      res.setEncoding('binary');
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const _dir = imgDir + path.basename(url);
        fs.writeFile(_dir, data, 'binary', err => {
          if (err) {
            console.log('图片写入文件错误：', err);
            return;
          }
          console.log('图片写入成功:', path.basename(url));
        });
      });
    })
    .on('error', err => {
      console.log('下载图片出错:', err);
    });
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
    // TODO:bai 数据获取被分开了要整合。还需要思考应该在哪里获取数据
    // downloadImg(path.resolve(__dirname + '/data/img/'), movie.picUrl);
    movies.push(movie);
  });
  return movies;
};

// TODO:bai 改为纯函数
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
        saveData(path.resolve(__dirname + '/data/data.json'), allMovies);
      });
    })
    .on('error', err => {
      console.log(err);
    });
};

for (let i = 0; i < 10; i += 1) {
  spider(getTargetDoubanMovieUrl(i));
}
