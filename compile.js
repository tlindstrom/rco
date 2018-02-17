let fs = require('fs-extra');
let sass = require('node-sass');
let rimraf = require('rimraf');
let nunjucks = require('nunjucks');
let cheerio = require('cheerio');

let hskVocabulary = require('./source/misc/hsk-vocabulary.json');

let data = {
    prefix: '/rco',

    articles: [],
    wordPages: []
};



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




// function that post-processes the rendered HTML
let processPage = function(page) {

    let $ = cheerio.load(page, { decodeEntities: false });

    // if words don't have details, try to fill them in from the vocabulary list
    $('[data-word]').each(function() {

        //let wordFromList = hskVocabulary.find(x => x.Traditional == $(this).html().trim());
        
        /*
        if (wordFromList){
            if (!$(this).attr('data-meaning')) $(this).attr('data-meaning', wordFromList.keyword);
            if (!$(this).attr('data-pinyin'))  $(this).attr('data-pinyin',  wordFromList.pinyin);
        }
        */


        // if it exists, add word page
        let wordpage = data.wordPages.find(x => x.metadata.title == $(this).html());
        if (wordpage) $(this).attr('data-wordpage', wordpage.metadata.title);

    });
    page = $.html({ decodeEntities: false });

    return page;
}








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
