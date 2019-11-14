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
    
    responseJson.posts.forEach(e => createArticle(e));
}

function createArticle (post) {
    //building up vote-section
    let upvote = document.createElement('img');
    upvote.className = 'upvote';
    upvote.src = "../assets/arrows/upvote.png";

    let scoreCount = document.createElement('h1');
    scoreCount.textContent = post.score;

    let downvote = document.createElement('img', { class: 'downvote', src: "../assets/arrows/downvote.png"});
    downvote.className = 'downvote';
    downvote.src = "../assets/arrows/downvote.png";

    let voteSection = document.createElement('div');
    voteSection.className = 'vote-section'
    voteSection.appendChild(upvote);
    voteSection.appendChild(scoreCount);
    voteSection.appendChild(downvote);

    //building up article-section
    let articleLink = document.createElement('a');
    articleLink.className = 'article-link';
    articleLink.href = post.url;
    articleLink.textContent = '(' + post.url + ')';

    let title = document.createElement('h1');
    title.textContent = post.title;
    title.appendChild(articleLink);

    let submitted = document.createElement('p');


    let articleSection = document.createElement('div');
    articleSection.className = 'article-section';
    articleSection.appendChild(title);

    //adding the elements to a li and then the ul element
    let newLi = document.createElement('li');
    newLi.appendChild(voteSection);
    newLi.appendChild(articleSection);

    let articleList = document.getElementById('article-list');
    articleList.appendChild(newLi);
}



window.onload = loadPosts;