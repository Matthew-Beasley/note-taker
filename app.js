const userContainer = document.querySelector('#user-container');
const notesContainer = document.querySelector('#notes-container');
const inputContainer = document.querySelector('#input-container');
const createButton = document.querySelector('#create');
const inputBox = document.querySelector('#words');

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


const renderUser = () => {
    userContainer.innerHTML = `
    <h4>${user.fullName}</h>
    <img src="${user.avatar}">
    <div>${user.bio}</div>`;
}


const renderNotes = async () => {
    let notesHtml = `
    <h4>Notes ${notes.length}</h4>
    <ul>`
    notes.forEach(item => { notesHtml += ` <button class="delete-button" data-id="${item.id}">X</button><li>${item.text}</li>` })
    notesHtml += '</ul>'
    notesContainer.innerHTML = notesHtml;
}


const deleteNote = async event => {
    event.preventDefault() //? do I wwant this to rerender
    const id = event.target.getAttribute('data-id');
    if (id) {
        console.log(`${API}/users/${user.id}/notes/${id}`)
        await axios.delete(`${API}/users/${user.id}/notes/${id}`);
    }
    notes = notes.filter(note => note.id !== id);
    renderNotes();
}


const postNote = async (event) => {
    event.preventDefault();

    const noteVal = { text: document.querySelector('#display').innerHTML = inputBox.value, id: user.id};
    notes.push(noteVal)
    const response = await axios.post(`${API}/users/${user.id}/notes`, noteVal);
    const created = response.data;
    renderNotes();
}


const startApp = async () => {
    user = await fetchUser();
    renderUser();
    const response = await axios.get(`${API}/users/${user.id}/notes`);
    notes = response.data;
    notes.forEach(note => console.log(note.id))
    renderNotes();
};


startApp();

createButton.addEventListener('click', postNote)
notesContainer.addEventListener('click', deleteNote)

