import { makeAutoObservable } from 'mobx';

class UserStore {
    id = null;
    email = null;
    isAuth = false;
    isAdmin = false;

    constructor() {
        makeAutoObservable(this);

        this.loadUserFromLocalStorage();
    }

    login({ id, email, role }) {
        this.id = id;
        this.email = email;
        this.isAuth = true;
        this.isAdmin = role === 'ADMIN';

        this.saveUserToLocalStorage();
    }

    logout() {
        this.id = null;
        this.email = null;
        this.isAuth = false;
        this.isAdmin = false;

        localStorage.removeItem('user');
    }

    saveUserToLocalStorage() {
        const userData = {
            id: this.id,
            email: this.email,
            isAuth: this.isAuth,
            isAdmin: this.isAdmin,
        };
        localStorage.setItem('user', JSON.stringify(userData));
    }

    loadUserFromLocalStorage() {
        const userData = localStorage.getItem('user');
        if (userData) {
            const { id, email, isAuth, isAdmin } = JSON.parse(userData);
            this.id = id;
            this.email = email;
            this.isAuth = isAuth;
            this.isAdmin = isAdmin;
        }
    }
}

export default UserStore;