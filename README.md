# Auditeurs

Christophe Haddad **1188n**

Nour Sarmout **1763t**

## Steps to Start App

1. Clone/Download the repository
2. Rename `.env.example` to `.env`
3. Replace `REACT_APP_GOOGLE_AUTH_CLIENT_ID` with a key from [here](https://console.developers.google.com)
4. Replace `REACT_APP_STRIPE_PUBLISH_KEY` and `STRIPE_SECRET_KEY` with their appropriate values from [here](https://dashboard.stripe.com/register)
5. Run the command `docker network create spring-microservices` inside the repository
6. Run the command `docker-compose up --build` inside the repository
7. Head to the assigned port for the react website, currently: http://localhost:3000

## Microservices

- **React Website:** Front-End for the e-commerce website
- **Data Service:** Provides data such as products, filters, categories and order information
- **Authentication Service:** Creates user accounts and handles username/password authentication
- **Payment Service:** Handles payment requests from the client
- **Search Suggestion Service:** Provides search suggestions for products/brands

## Features

- Google OAuth 2.0 support for quick login
- Regular Username/Password authentication
- Search bar and Search suggestions help to find products quickly
- Stores user information in the MySQL database
- Stores API data in Redis Cache to minimize network calls
- Select filters to display products based on the selections
- Sort products by popularity, newest, and prices
- Pagination
- Stores authentication details in cookies
- Store cart's product information in cookies
- Payment service using Stripe's API to buy products (fake payment)

## Known Issues

- If the docker-compose process cuts midway, it most probably means it's a connection issue, retry the docker-compose again
- Payment stopped working, needs investigation

## Tools and References

- [Create React App](https://reactjs.org/docs/create-a-new-react-app.html)
- [Docker](http://docker.com/)
- [CORS support in spring](https://spring.io/blog/2015/06/08/cors-support-in-spring-framework)
- [Material-UI](https://material-ui.com/)
- [Semantic-UI](https://react.semantic-ui.com/)
- [Swiper JS](https://swiperjs.com/demos/)
- [Redis commands](https://redis.io/commands)
- [Spring Inegration](http://modelmapper.org/user-manual/spring-integration/)
- [Redis + Spring Tutorial](https://www.baeldung.com/spring-data-redis-tutorial)
- [JS Cookie](https://github.com/js-cookie/js-cookie)
- [React hooks](https://reactjs.org/docs/hooks-reference.html)
- [Redux form](https://redux-form.com/8.3.0/docs/gettingstarted.md/)
- [React redux](https://react-redux.js.org/api/connect)
- [Redux thunk](https://github.com/reduxjs/redux-thunk)
- [Spring data jpa one to many mapping](https://attacomsian.com/blog/spring-data-jpa-one-to-many-mapping)
- [Stripe](https://stripe.com)
- [OAuth2](https://developers.google.com/identity/protocols/oauth2)
