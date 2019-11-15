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
    // building up vote-section
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

    // building up article-section
    let articleLink = document.createElement('a');
    articleLink.className = 'article-link';
    articleLink.href = post.url;
    articleLink.textContent = '(' + post.url + ')';

    let title = document.createElement('h1');
    title.textContent = post.title;
    title.appendChild(articleLink);

    let submitted = document.createElement('p');
    let timeDiff = timeDifference(Date.now(), post.timestamp);
    submitted.textContent = 'submitted ' + timeDiff + ' by '

    let username = document.createElement('a');
    username.className = 'username';
    username.textContent = 'anonymus';
    submitted.appendChild(username);

    // adding update and delete anchor tags
    let actions = document.createElement('p');
    actions.className = 'actions';
    let updatePost = document.createElement('a');
    updatePost.className = 'update';
    updatePost.textContent = 'update';
    let deletePost = document.createElement('a');
    deletePost.className = 'delete';
    deletePost.textContent = 'delete';

    actions.appendChild(updatePost);
    actions.appendChild(deletePost);

    // adding elements to the article-section
    let articleSection = document.createElement('div');
    articleSection.className = 'article-section';
    articleSection.appendChild(title);
    articleSection.appendChild(submitted);
    articleSection.appendChild(actions);

    // adding the elements to a li and then the ul element
    let newLi = document.createElement('li');
    newLi.appendChild(voteSection);
    newLi.appendChild(articleSection);

    let articleList = document.getElementById('article-list');
    articleList.appendChild(newLi);
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

window.onload = loadPosts;