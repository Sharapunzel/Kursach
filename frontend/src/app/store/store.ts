import {makeAutoObservable, observable, runInAction} from "mobx";
import $api from "../api/axois";
import BFF_Service from "../api/Services/BFF_Service";
import {ErrorResponse} from "../models/ErrorResponse";
import {SPARoutes} from "../routes/spa/SPARoutes";
import {BFFRoutes} from "../routes/api/BFFRoutes";


export default class Store{

    user: UserData | null = null;
    isAuth: boolean = false;
    isAuthLoading: boolean = false;
    isDataLoading: boolean = false;
    isError: boolean = false;
    errorMessage: string = "Что-то пошло не так"
    //roles: string[] = [];

    constructor() {
        makeAutoObservable(this);
    }


    login(){
        window.location.replace(`${import.meta.env.VITE_BASE_BFF_URL}${BFFRoutes.LOGIN}`);
    }

    logout() {
        if (window.confirm("Вы уверены что хотите закончить сессию?")){
            this.AuthLoadingON();
            this.setAuth(false);
            this.setUser(null);
            BFF_Service.Logout()
                .then((res: any) => {
                    if (res.status === 200) {
                        alert("Сессия окончена!");
                    }
                })
                .catch((err) => {
                    if (err.response?.data && (err.response.data as ErrorResponse).status && (err.response.data as ErrorResponse).message){
                        const errorResponse:ErrorResponse = err.response.data as ErrorResponse;
                        this.ErrorON(errorResponse.message);
                    }
                    else{
                        this.ErrorON(err.toString());
                    }
                })
                .finally(() => {
                    this.AuthLoadingOFF();
                })
        }
    };


    setAuth(bool: boolean) {
        runInAction(()=>{
            this.isAuth = bool;
        })
    }

    setUser(user: UserData | null){
        runInAction(()=>{
            this.user = user;
        })
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
        this.errorMessage = message;
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
