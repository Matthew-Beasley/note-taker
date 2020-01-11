const userContainer = document.querySelector('#user-info');
const notesContainer = document.querySelector('#notes');
const createButton = document.querySelector('#create');
const inputBox = document.querySelector('#words');

console.log(createButton)
let user, notes;

const API = 'https://acme-users-api-rev.herokuapp.com/api';

const fetchUser = async () => {
    const storage = window.localStorage;
    const userId = storage.getItem('userId');
    if (userId) {
        try {
            return (await axios.get(`${API}/users/detail/${userId}`)).data;
        }
        catch (ex) {
            storage.removeItem('userId');
            return fetchUser();
        }
    }
    const user = (await axios.get(`${API}/users/random`)).data;
    storage.setItem('userId', user.id);
    return user;
};

const renderNotes = async () => {
    const storage = window.localStorage;
    notes = await axios.get(`${API}/users/${user.id}/notes`);

    let notesHtml = `
    <ul>`
    notes.data.forEach(item => { notesHtml += `<li>${item.text}</li>` })

    notesHtml += '</ul>'
    notesContainer.innerHTML = notesHtml;
}

const renderUser = () => {
    userContainer.innerHTML = `
    <h4>${user.fullName}</h>
    <img src="${user.avatar}">
    <div>${user.bio}</div>`;
}

const startApp = async () => {
    user = await fetchUser();
    renderUser();
    renderNotes();
};

const displayText = (event) => {
    event.preventDefault();
    console.log(event)
    document.querySelector('#display').innerHTML = inputBox.value;
}

startApp();

createButton.addEventListener('click', displayText)

