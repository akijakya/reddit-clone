'use strict';

const url = 'http://localhost:3000';
const submitForm = document.forms['submit-article'];

submitForm.addEventListener ('submit', async function (e) {
    e.preventDefault();    // mivel a default behavior hogy ilyenkor újratölti az oldalt, de mi ezt most nem akarjuk
    const articleTitle = submitForm.querySelector('textarea[type="text"]').value ; // az érték amit bevittek a mezőbe
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
        const submitButton = document.getElementsByTagName('aside')[0].getElementsByTagName('button')[0];
        submitButton.className = 'clicked';
        submitButton.textContent = 'Successfully posted!';
        setTimeout(() => window.location.assign('/'), 1000);
    } catch (reason) {
        console.log(reason);
    }
});