import {makeAutoObservable, observable, runInAction} from "mobx";
import $api from "../api/axois";
import BFF_Service from "../api/Services/BFF_Service";


export default class Store{

    user: string = "";
    Logout: boolean = true;
    isAuth: boolean = false;
    isAuthLoading: boolean = true;
    isDataLoading: boolean = false;
    isError: boolean = false;
    errorMessage: string = "Что-то пошло не так"
    //roles: string[] = [];

    constructor() {
        makeAutoObservable(this);
    }


    //Methods
    async login() {
        if(!this.isAuth){
            window.location.replace(`${import.meta.env.VITE_BASE_BFF_URL}/Login`);
        }
    }

    async logout() {
        try {
            this.setAuth(false);
            this.setLogout(true);
            await BFF_Service.Logout();
        } catch (e: any) {
            console.log(e.response)
        }
    }

    async checkAuth() {
        try {
            const response = await BFF_Service.CheckSession();
            this.setLogout(false);
            this.setAuth(true)
            // this.setRoles(response.data.roles)
            this.setUser(response.data.toString())
        } catch (e: any) {
            await this.logout()
        }
    }



    //Setters
    setUser(user: string) {
        runInAction(() => {
            this.user = user
        })
    }

    // setRoles(rols: string[]) {
    //     runInAction(() => {
    //         this.roles = rols
    //     })
    // }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setAuthLoading(bool: boolean) {
        this.isAuthLoading = bool;
    }

    setDataLoading(bool: boolean) {
        this.isDataLoading = bool;
    }

    setError(bool: boolean) {
        this.isError = bool;
    }

    setErrorMessage(message: string) {
        this.isError = message;
    }

    setLogout(bool: boolean) {
        this.Logout = bool;
    }


    //Actions
    AuthLoadingON() {
        runInAction(() => {
            this.setAuthLoading(true);
        })
    }

    AuthLoadingOFF() {
        runInAction(() => {
            this.setAuthLoading(false);
        })
    }

    DataLoadingON() {
        runInAction(() => {
            this.setDataLoading(true);
        })
    }

    DataLoadingOFF() {
        runInAction(() => {
            this.setDataLoading(false);
        })
    }

    ErrorON(message?: string) {
        runInAction(() => {
            this.setError(true);
            if (message) this.setErrorMessage(message);
        })
    }

    ErrorOFF() {
        runInAction(() => {
            this.setError(false);
            this.setErrorMessage("Что-то пошло не так");
        })
    }

}
