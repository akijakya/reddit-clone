'use strict';

const url = 'http://localhost:3000';
const editForm = document.forms['edit-article'];

// getting the id of the post passed through the address bar
// const passedId = window.location.pathname.substring(1, 3);
let params = new URLSearchParams(document.location.search.substring(1));
let passedId = params.get('id');

// modifying caption in the header
let headerCaption = document.getElementsByTagName('h2')[0];
headerCaption.textContent = `Edit post #${passedId}`;

async function fillContent () {
    try {
        let response = await fetch(`${url}/posts/${passedId}`, {
            method: "GET"
        })
        let responseJson = await response.json();
        const articleTitle = editForm.querySelector('textarea[type="text"]');
        const articleUrl = editForm.querySelector('input[type="url"]');
        articleTitle.value = responseJson.title;
        articleUrl.value = responseJson.url;
    } catch (reason) {
        console.log(reason);
    }
}

fillContent();

editForm.addEventListener ('submit', async function (e) {
    e.preventDefault();    // mivel a default behavior hogy ilyenkor újratölti az oldalt, de mi ezt most nem akarjuk
    const articleTitle = editForm.querySelector('textarea[type="text"]').value ; // az érték amit bevittek a mezőbe
    const articleUrl = editForm.querySelector('input[type="url"]').value;
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