const userContainer = document.querySelector('#user-info');
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
    console.log(user)
    userContainer.innerHTML = `
    <h3>${user.fullName}</h3>
    <div>${user.email}</div>
    <img src="${user.avatar}">
    <div>${user.bio}</div>`;
}

const startApp = async () => {
    user = await fetchUser();
    console.log(user);
    renderUser();
};

startApp();

