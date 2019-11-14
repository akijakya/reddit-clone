'use strict';

// const config = require('../../config');
// const port = config.app.port;

// function loadPosts () {
//     // fetch (`http://localhost:${port}/posts/`)
//     fetch ('http://localhost:3000/posts/')
//     .then(response => response.json())
//     .then(myJson => {
//         console.log(myJson);
//     })
//     .catch((reason) => {
//         console.log(reason);
//         console.log('Some error happened');
//     });
// }

async function loadPosts () {
    let responseJson = {};
    try {
        let response = await fetch('http://localhost:3000/posts/');
        responseJson = await response.json();
    } catch (reason) {
        console.log(reason);
    }
    console.log(responseJson);
}

window.onload = loadPosts;