export const LS_LANG = 'lang';
export const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const APIUrl = development ? process.env.REACT_APP_API_URL : 'https://google.com';
