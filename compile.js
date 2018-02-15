let fs = require('fs-extra');
let sass = require('node-sass');
let rimraf = require('rimraf');
let nunjucks = require('nunjucks');

let data = {
    prefix: '/rco',

    articles: [],
    wordPages: []
};



let processPage = function(page) {


    return page;
}





// load data
console.log('\n--- LOADING DATA ---\n');

fs.readdirSync(__dirname + '/source/content/articles').forEach(x => {
    console.log('READING FILE: ' + __dirname + '/source/content/articles/' + x);
    let file = fs.readFileSync(__dirname + '/source/content/articles/' + x, 'utf8').split('---');
    data.articles.push({
        metadata: JSON.parse(file.shift()),
        body: file.join('---'),
        filename: x
    });
});

fs.readdirSync(__dirname + '/source/content/word-pages').forEach(x => {
    console.log('READING FILE: ' + __dirname + '/source/content/word-pages/' + x);
    let file = fs.readFileSync(__dirname + '/source/content/word-pages/' + x, 'utf8').split('---');
    data.wordPages.push({
        metadata: JSON.parse(file.shift()),
        body: file.join('---'),
        filename: x
    });
});

// render pages
console.log('\n--- RENDERING PAGES ---\n');
nunjucks.configure(__dirname + '/source/templates', { autoescape: false });

console.log('DELETING AND RECREATING dist DIRECTORY');
rimraf.sync(__dirname + '/dist');
fs.mkdirSync(__dirname + '/dist');

fs.writeFileSync(__dirname + '/dist/index.html', processPage(nunjucks.render('home.html', {
    data: data,
    page: {
        title: 'Home'
    }
})));

fs.mkdirSync(__dirname + '/dist/articles');
data.articles.forEach(article => {
    console.log('WRITING FILE: ' + __dirname + '/dist/articles/' + article.filename);
    fs.writeFileSync(__dirname + '/dist/articles/' + article.filename, processPage(nunjucks.render('article.html', {
        data: data,
        page: {
            title: article.metadata.title
        },
        article: article
    })));
});

fs.mkdirSync(__dirname + '/dist/words');
data.wordPages.forEach(word => {
    console.log('WRITING FILE: ' + __dirname + '/dist/words/' + word.filename);
    fs.writeFileSync(__dirname + '/dist/words/' + word.filename, processPage(nunjucks.render('word.html', {
        data: data,
        page: {
            title: word.metadata.title
        },
        word: word
    })));
});





// compile assets
console.log('\n--- COMPILING ASSETS ---\n');

fs.mkdirSync(__dirname + '/dist/assets');

console.log('COPYING IMAGES');
fs.copySync(__dirname + '/source/assets/img', __dirname + '/dist/assets/img');

console.log('COPYING JS');
fs.copySync(__dirname + '/source/assets/js', __dirname + '/dist/assets/js');

console.log('COMPILING SCSS');
let renderedCss = sass.renderSync({
    file: __dirname + '/source/assets/scss/styles.scss'
}).css;
fs.writeFileSync("./dist/assets/styles.css", renderedCss);

console.log("\n--- COMPILATION DONE! ---\n");
