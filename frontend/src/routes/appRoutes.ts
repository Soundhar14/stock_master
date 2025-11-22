export const appRoutes = {
  home: '/',
  signIn: '/signin',
  dashboard: '/dashboard',
  masterRoutes: {
    master: '/master',
    children: {
      warehouse : '/master/warehouse',
    }
  }
}