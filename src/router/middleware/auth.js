export default function auth({ next, store }) {
  if (!store.state.auth.userLoggedIn) {
    return next({
      name: "login",
    });
  }

  return next();
}
