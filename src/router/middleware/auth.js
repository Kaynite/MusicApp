export default function auth({ next, store }) {
  if (!store.state.userLoggedIn) {
    return next({
      name: "login",
    });
  }

  return next();
}
