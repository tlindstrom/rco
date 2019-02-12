import Vue from 'vue';

import './js/rco';
import './js/tongwen/tongwen-ts';

console.log('hellow wbpack');

let app = new Vue({
    el: '#vue-app',
    data: {
      message: 'Hello Vue!'
    },
    delimiters: ['${', '}']
});