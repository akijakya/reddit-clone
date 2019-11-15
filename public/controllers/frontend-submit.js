'use strict';

const addForm = document.forms;

addForm.addEventListener = ('submit', function (e) {
    e.preventDefault();    // mivel a default behavior hogy ilyenkor újratölti az oldalt, de mi ezt most nem akarjuk
    // const value = addForm.querySelector('input[type="text"]').value  // az érték amit bevittek a mezőbe
    console.log('clicked');
});