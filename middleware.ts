import { APP_LINKS } from './constants/URLs'

export { default } from 'next-auth/middleware'
export const config = {
  matcher: ['/cart'],
}
// export const config = {
//   matcher: [APP_LINKS.CART, APP_LINKS.HOME, 'app/:cart*'],
// }

// 'app/:cart*' will proect all domains of app/cart
