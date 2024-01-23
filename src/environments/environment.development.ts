export const environment = {
    production: true,
    baseURL: '/' + (window.location.pathname.split('/')[1] || ''),
};
