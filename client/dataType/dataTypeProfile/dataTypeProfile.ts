export interface userProfileInfo {
    userName: string;
    name: string;
    password: string;
    Brithday?: any;
}
export interface responseUserInfo extends userProfileInfo {
    _id:string
}
export interface userContactInfo {
    
    phone: string;
    email: string;
    address: string;
    website: string;
    postCode: string;
    city: string;
    street: string;
}
export interface responseContanctInfo extends userContactInfo {

    userId:string;
}
export interface userComapnyInfo {
    
    phone: string;
    nameComapny:string,
    email: string;
    address: string;
    website: string;
    postCode: string;
    city: string;
    street: string;
}
export interface responseCompanyInfo extends userComapnyInfo {

    userId:string;
}