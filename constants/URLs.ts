// export enum FetchLinks {
//     ALL_COUNTRIES = 'https://restcountries.com/v3.1/all?fields=name,flags,region,languages,capital,maps,cca3,cca2,coatOfArms',
//     ALL_COUNTRIES_SEARCH_BAR = 'https://restcountries.com/v3.1/all?fields=name,flags,cca3,region',
//     ONE_COUNTRY_BASE = 'https://restcountries.com/v3.1/alpha',
//     ALL_ISO = 'https://restcountries.com/v3.1/all?fields=cca2,cca3,name',
//     ALL_CAPITAL = 'https://restcountries.com/v3.1/all?fields=cca3,name,capital',
// }

export enum APP_LINKS {
  HOME = '/',
  CART = '/cart',
  DASHBOARD = '/dashboard',
}

export enum REST_API_LINKS {
  SALE = 'api/sales',
  PRODUCTS = 'api/products',
  PRODUCTS_FAV = 'api/products/toggle-fav',
  USERS = 'api/users',
}

export enum URL_PARAMS_KEYS {
  PAGE = 'page',
  SEARCH = 'search',
  CATEGORY_1 = 'category1',
  SHOW_ONLY_FAV = 'favOnly',
  AXIS = 'axis',
  BRAND = 'brands',

  // For API calls
  BRANDS_IDS = 'brands',
  USER_ID = 'userID',
  GET_UNIQUE_CAT = 'getUniqueCat',
  GET_UNIQUE_AXIS = 'getUniqueAxis',
  BY_TOP_SELLER = 'byTopSeller',
}

// export const NAV_LINKS = [
//     {
//         item: 'Home',
//         link: APP_LINKS.HOME,
//         id: 'Links-1',
//     },

//     {
//         item: 'Play',
//         link: APP_LINKS.PLAY,
//         id: 'Links-3',
//     },
//     {
//         item: 'About Me',
//         link: APP_LINKS.ABOUT,
//         id: 'Links-2',
//     },
// ]
