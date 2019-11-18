'use strict';

const url = 'http://localhost:3000';
const submitForm = document.forms['submit-article'];

submitForm.addEventListener ('submit', function (e) {
    e.preventDefault();    // mivel a default behavior hogy ilyenkor újratölti az oldalt, de mi ezt most nem akarjuk
    const title = submitForm.querySelector('textarea[type="text"]').value ; // az érték amit bevittek a mezőbe
    const url = submitForm.querySelector('input[type="url"]').value;
    const data = {
        "title": title,
        "url": url
    };
    
    console.log(data);

    // fetch (`${url}/posts/`, {
    //         method: "POST",
    //         body: JSON.stringify(data),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json'
    //         }
    //     })
    //     .then((response) => {
    //         console.log(response);
    //         response.json().then((responseJson) => {
    //             console.log(responseJson);
    //         });
    //     });
    try {
        let response = fetch(`${url}/posts/`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        let responseJson = response.json();
        console.log(responseJson);
    } catch (reason) {
        console.log(reason);
    }
});