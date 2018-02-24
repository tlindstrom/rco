let path = require('path');
let fs = require('fs-extra');
let sass = require('node-sass');
let rimraf = require('rimraf');
let nunjucks = require('nunjucks');
let cheerio = require('cheerio');

let hskVocabulary = require('./source/misc/hsk-vocabulary.json');

let data = {
    prefix: '/rco',
};



let deepCopy = function(array){
    return array.map(a => Object.assign({}, a));
}



// load data
console.log('\n--- LOADING DATA ---\n');

let readContent = function(dir, outputUrl, breadcrumbs) {

    console.log("LOADING DIRECTORY:", dir);
    
    let node = {
        _url: outputUrl,
        _pages: []
    }

    // if index.html exists, append it to the breadcrumbs
    let indexPath = path.join(dir, 'index.html');
    if (fs.existsSync(indexPath)) {
        let file = fs.readFileSync(indexPath, 'utf8').split('---');
        breadcrumbs.push({
            title: eval('('+ file[0] +')').title,
            url: outputUrl + '/' + 'index.html',
            current: false
        });
    }
    
    fs.readdirSync(dir).forEach(x => {
        let fullPath = path.join(dir, x);
        if (fs.lstatSync(fullPath).isDirectory()) node[x] = readContent(fullPath, outputUrl+'/'+x, deepCopy(breadcrumbs));
        else {
            let file = fs.readFileSync(fullPath, 'utf8').split('---');

            let priority = 99999;
            if (x.match(/^[0-9]+_.+$/)){
                priority = Number(x.split('_')[0]);
                x = x.split('_')[1];
            }

            let newNode = {
                metadata: eval('('+file.shift()+')'),
                body: file.join('---'),
                filename: x,
                url: outputUrl+'/'+x,
            }
            
            let bc = deepCopy(breadcrumbs);
            if (x !== 'index.html'){
                bc.push({
                    title: newNode.metadata.title,
                    url: newNode.url,
                    current: false
                });
            }
            bc[bc.length-1].current = true;
            newNode.metadata.breadcrumbs = bc;

            node._pages.push(newNode);

            
        }
    });

    return node;
}

data.content = readContent(
    path.join(__dirname, 'source', 'content'),
    data.prefix,
    []
);











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
        let wordpage = data.content['words']._pages.find(x => x.metadata.title == $(this).html());
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




// render page tree
let renderPages = function(node, dir) {

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    node._pages.forEach(x => {
        console.log('WRITING FILE: ' + path.join(dir, x.filename));
        fs.writeFileSync(path.join(dir, x.filename), processPage(nunjucks.renderString(x.body, {
            data: data,
            page: x.metadata
        })));
    });
    Object.keys(node).forEach(x => {
        if (x[0] !== '_') renderPages(node[x], path.join(dir, x));
    });
}
renderPages(data.content, path.join(__dirname, 'dist/'));



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


console.log("\n--- COMPILATION DONE ---\n");

console.log("\n--- WRITING DEBUG DATA ---\n");

// create debug folder
rimraf.sync(__dirname + '/debug');
fs.mkdirSync(__dirname + '/debug');
fs.writeFileSync(path.join(__dirname, 'debug', 'data.json'), JSON.stringify(data.content, false, 4));

console.log("\n--- ALL DONE! ---\n");