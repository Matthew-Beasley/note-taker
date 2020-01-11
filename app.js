const userContainer = document.querySelector('#user-info');
const notesContainer = document.querySelector('#notes');
console.log(notesContainer)
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
    notes = await axios.get(`${API}/users/${user.id}/notes`);
    console.log(notes);
}

const renderUser = () => {
    console.log(user)
    userContainer.innerHTML = `
    <h4>${user.fullName}</h>
    <img src="${user.avatar}">
    <div>${user.bio}</div>`;
}

const startApp = async () => {
    user = await fetchUser();
    console.log(user);
    renderUser();
    renderNotes();
};

startApp();

