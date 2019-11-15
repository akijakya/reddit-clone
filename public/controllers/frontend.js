'use strict';

let upVoted = false;
let downVoted = false;

let url = 'http://localhost:3000';

async function loadPosts () {
    let responseJson = {};

    try {
        let response = await fetch(`${url}/posts/`);
        responseJson = await response.json();
    } catch (reason) {
        console.log(reason);
    }
    
    responseJson.posts.forEach(e => createArticle(e));
}

async function upVote (id) {
    let responseJson = {};
    let article = document.getElementById(`${id}`);
    let arrowUp = article.getElementsByTagName('img')[0];
    let arrowDown = article.getElementsByTagName('img')[1];

    if (arrowUp.src === `${url}/assets/arrows/upvote.png`) {
        try {
            let response = await fetch(`${url}/posts/${id}/upvote`, {
                method: "PUT"
            });
            responseJson = await response.json();
            arrowUp.src = "../assets/arrows/upvoted.png"

            if (arrowDown.src === `${url}/assets/arrows/downvoted.png`) {
                let response = await fetch(`${url}/posts/${id}/upvote`, {
                method: "PUT"
                });
                responseJson = await response.json();
                arrowDown.src = "../assets/arrows/downvote.png"
            }
        } catch (reason) {
            console.log(reason);
        }

        // changing the displayed number
        let scoreNumber = article.getElementsByTagName('h1')[0];
        scoreNumber.textContent = responseJson.score;
    }
}

async function downVote (id) {
    let responseJson = {};
    let article = document.getElementById(`${id}`);
    let arrowUp = article.getElementsByTagName('img')[0];
    let arrowDown = article.getElementsByTagName('img')[1];

    if (arrowDown.src === `${url}/assets/arrows/downvote.png`) {
        try {
            let response = await fetch(`${url}/posts/${id}/downvote`, {
                method: "PUT"
            });
            responseJson = await response.json();
            arrowDown.src = "../assets/arrows/downvoted.png"

            if (arrowUp.src === `${url}/assets/arrows/upvoted.png`) {
                let response = await fetch(`${url}/posts/${id}/downvote`, {
                method: "PUT"
                });
                responseJson = await response.json();
                arrowUp.src = "../assets/arrows/upvote.png"
            }
        } catch (reason) {
            console.log(reason);
        }

        // changing the displayed number
        let scoreNumber = article.getElementsByTagName('h1')[0];
        scoreNumber.textContent = responseJson.score;
    }
}

function createArticle (post) {
    // building up vote-section
    let upvote = document.createElement('img');
    upvote.className = 'upvote';
    upvote.src = "../assets/arrows/upvote.png";
    upvote.setAttribute('onclick', `upVote(${post.id});`);

    let scoreCount = document.createElement('h1');
    scoreCount.textContent = post.score;

    let downvote = document.createElement('img', { class: 'downvote', src: "../assets/arrows/downvote.png"});
    downvote.className = 'downvote';
    downvote.src = "../assets/arrows/downvote.png";
    downvote.setAttribute('onclick', `downVote(${post.id});`);

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
    newLi.id = post.id;
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
    } else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    } else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    } else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

window.onload = loadPosts;