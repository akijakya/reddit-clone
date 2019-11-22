'use strict';

const url = 'http://localhost:3000';

async function loadPosts () {
    let responseJson = {};

    try {
        let response = await fetch(`${url}/posts/`);
        responseJson = await response.json();
    } catch (reason) {
        console.log(reason);
    }

    // filling up article section with articles from the database
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
    } else if (arrowUp.src === `${url}/assets/arrows/upvoted.png`) {
        try {
            let response = await fetch(`${url}/posts/${id}/downvote`, {
                method: "PUT"
            });
            responseJson = await response.json();
            arrowUp.src = "../assets/arrows/upvote.png"
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
    } else if (arrowDown.src === `${url}/assets/arrows/downvoted.png`) {
        try {
            let response = await fetch(`${url}/posts/${id}/upvote`, {
                method: "PUT"
            });
            responseJson = await response.json();
            arrowDown.src = "../assets/arrows/downvote.png"
        } catch (reason) {
            console.log(reason);
        }
        // changing the displayed number
        let scoreNumber = article.getElementsByTagName('h1')[0];
        scoreNumber.textContent = responseJson.score;
    }
}

async function deletePost (id) {
    let responseJson = {};
    try {
        let response = await fetch(`${url}/posts/${id}`, {
            method: "DELETE"
        });
        responseJson = await response.json();
    } catch (reason) {
        console.log(reason);
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

    // adding edit and delete anchor tags
    let actions = document.createElement('p');
    actions.className = 'actions';
    let editPost = document.createElement('a');
    editPost.className = 'edit';
    editPost.textContent = 'modify';
    editPost.setAttribute('onclick', `showEditView(${post.id});`);
    let deletePost = document.createElement('a');
    deletePost.className = 'delete';
    deletePost.textContent = 'delete';
    deletePost.setAttribute('onclick', `deletePost(${post.id});`);
    deletePost.setAttribute('href', `${url}/`);

    actions.appendChild(editPost);
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

// SUBMIT FORM VIEW

let submitForm = document.getElementsByTagName('form')[0];
// const submitForm = document.forms['submit-article'];
let asideSection = document.getElementsByTagName('aside')[0];

// submit a new post button click event
let newPostButton = document.getElementById('new-post');
newPostButton.addEventListener('click', () => showSubmitView());

function showSubmitView () {
    // removing posts and new post button
    let posts = document.getElementsByTagName('posts')[0];
    let postList = document.getElementById('article-list');
    // postList.className = 'hidden';
    let removePostList = posts.removeChild(postList);
    asideSection.removeChild(newPostButton);

    buildSubmitForm();

    submitForm.id = 'submit-article';
    submitForm.hidden = false;

    newPostEventListener();

    // adding new button
    let submitButton = document.createElement('button');
    submitButton.id = 'submit-button';
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('form', 'submit-article');
    submitButton.textContent = 'Submit!';
    asideSection.insertBefore(submitButton, asideSection.firstChild);

    // changing the header h2
    let headerH2 = document.getElementsByTagName('h2')[0];
    headerH2.textContent = 'Post to /r/space';
}

function buildSubmitForm () {
    let titleLabel = document.createElement('label');
    titleLabel.for = 'text';
    titleLabel.textContent = 'title';

    let titleField = document.createElement('textarea');
    titleField.setAttribute ('type', 'text');
    titleField.id = 'text';
    titleField.name = 'text';
    titleField.rows = '3';
    titleField.required = true;

    let urlLabel = document.createElement('label');
    urlLabel.for = 'url';
    urlLabel.textContent = 'url';

    let urlField = document.createElement('input');
    urlField.setAttribute ('type', 'url');
    urlField.id = 'url';
    urlField.name = 'url';
    urlField.required = true;

    // appending children for the form
    submitForm.appendChild(titleLabel);
    submitForm.appendChild(titleField);
    submitForm.appendChild(urlLabel);
    submitForm.appendChild(urlField);
}

function newPostEventListener () {
    submitForm.addEventListener ('submit', async function (e) {
        e.preventDefault();  
        const articleTitle = submitForm.querySelector('textarea[type="text"]').value ;
        const articleUrl = submitForm.querySelector('input[type="url"]').value;
        const data = {
            "title": articleTitle,
            "url": articleUrl
        };
        
        try {
            let response = await fetch(`${url}/posts/`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            let responseJson = await response.json();
            // console.log(responseJson);
            let submitButton = asideSection.getElementsByTagName('button')[0];
            submitButton.className = 'clicked';
            submitButton.textContent = 'Successfully posted!';
            setTimeout(() => window.location.assign('/'), 1000);
        } catch (reason) {
            console.log(reason);
        }
    });
}

// EDIT FORM VIEW

let passedId = 0;

function showEditView (id) {
    passedId = id;

    // removing posts and new post button
    let posts = document.getElementsByTagName('posts')[0];
    let postList = document.getElementById('article-list');
    // postList.className = 'hidden';
    let removePostList = posts.removeChild(postList);
    asideSection.removeChild(newPostButton);

    buildSubmitForm();
    fillContent();

    submitForm.id = 'edit-article';
    submitForm.hidden = false;

    editEventListener();

    // adding new button
    let submitButton = document.createElement('button');
    submitButton.id = 'submit-button';
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('form', 'edit-article');
    submitButton.textContent = 'Save changes';
    asideSection.insertBefore(submitButton, asideSection.firstChild);

    // changing the header h2
    let headerH2 = document.getElementsByTagName('h2')[0];
    headerH2.textContent = `Edit post #${passedId}`;
}

function editEventListener () {
    submitForm.addEventListener ('submit', async function (e) {
        e.preventDefault();
        const articleTitle = submitForm.querySelector('textarea[type="text"]').value ;
        const articleUrl = submitForm.querySelector('input[type="url"]').value;
        const data = {
            "title": articleTitle,
            "url": articleUrl
        };
        
        try {
            let response = await fetch(`${url}/posts/${passedId}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            let responseJson = await response.json();
            // console.log(responseJson);
            const submitButton = document.getElementsByTagName('aside')[0].getElementsByTagName('button')[0];
            submitButton.className = 'clicked';
            submitButton.textContent = 'Successfully edited!';
            setTimeout(() => window.location.assign('/'), 1000);
        } catch (reason) {
            console.log(reason);
        }
    });
}

async function fillContent () {
    try {
        let response = await fetch(`${url}/posts/${passedId}`, {
            method: "GET"
        })
        let responseJson = await response.json();
        const articleTitle = submitForm.querySelector('textarea[type="text"]');
        const articleUrl = submitForm.querySelector('input[type="url"]');
        articleTitle.value = responseJson.title;
        articleUrl.value = responseJson.url;
    } catch (reason) {
        console.log(reason);
    }
}

window.onload = loadPosts;