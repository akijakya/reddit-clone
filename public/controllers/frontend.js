'use strict';

const config = require('../..config');
const port = config.app.port;

// function loadRedditFront () {

// }

function loadPosts () {
    fetch (`http://localhost:${port}/posts/`)
    .then(response => response.json())
    // .then(myJson => joke.textContent = myJson.value.joke)
    // .catch((reason) => {
    //     console.log(reason);
    //     console.log('Some error happened');
    // });
}

// window.onload = loadRedditFront;