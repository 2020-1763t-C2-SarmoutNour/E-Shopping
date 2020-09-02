# Auditeurs

Christophe Haddad **1188n**

Nour Sarmout **1763t**

## Steps to Start App

1.

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

## Tools and References

- [Create React App](https://reactjs.org/docs/create-a-new-react-app.html)
- [Docker](http://docker.com/)
