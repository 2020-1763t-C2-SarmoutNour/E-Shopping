import {
  HANDLE_SIGN_IN,
  HANDLE_SIGN_UP_ERROR,
  HANDLE_SIGN_OUT,
  HANDLE_SIGN_IN_ERROR,
  LOAD_FILTER_PRODUCTS,
  LOAD_FILTER_ATTRIBUTES,
  SHIPPING_ADDRESS_CONFIRMED,
  PAYMENT_INFO_CONFIRMED,
  PAYMENT_RESPONSE,
  HANDLE_GOOGLE_AUTH_SIGN_IN,
  HANDLE_GOOGLE_AUTH_SIGN_OUT,
  PAYMENT_RESPONSE_ERROR,
  SEARCH_KEYWORD_ERROR,
  SEARCH_KEYWORD,
} from './types';
import {
  INTERNAL_SERVER_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
} from '../constants/http_error_codes';
import {
  SHOPPERS_PRODUCT_INFO_COOKIE,
  CART_TOTAL_COOKIE,
  AUTH_DETAILS_COOKIE,
} from '../constants/cookies';
import history from '../history';
import { Base64 } from 'js-base64';
import Cookies from 'js-cookie';
import {
  commonServiceAPI,
  authServiceAPI,
  searchSuggestionServiceAPI,
} from '../api/service_api';
import axios from 'axios';
import {
  DEFAULT_SEARCH_SUGGESTION_API,
  SEARCH_SUGGESTION_API,
} from '../constants/api_routes';

export const setAuthDetailsFromCookie = (savedResponse) => {
  return {
    type: HANDLE_SIGN_IN,
    payload: savedResponse,
  };
};

export const setShippingAddress = (payload) => {
  return {
    type: SHIPPING_ADDRESS_CONFIRMED,
    payload: payload,
  };
};

export const setPaymentInfo = (payload) => {
  return {
    type: PAYMENT_INFO_CONFIRMED,
    payload: payload,
  };
};

export const signIn = (formValues) => async (dispatch) => {
  const hash = Base64.encode(`${formValues.username}:${formValues.password}`);
  authServiceAPI.defaults.headers.common['Authorization'] = `Basic ${hash}`;
  const response = await authServiceAPI.post('/authenticate').catch((err) => {
    dispatch({ type: HANDLE_SIGN_IN_ERROR, payload: err.message });
  });

  if (response) {
    if (response.data.jwt) {
      dispatch({ type: HANDLE_SIGN_IN, payload: response.data });
      Cookies.set(AUTH_DETAILS_COOKIE, response.data, { expires: 2 });
      history.push('/');
    } else {
      dispatch({ type: HANDLE_SIGN_IN_ERROR, payload: response.data.error });
    }
  }
};

export const signOut = () => {
  Cookies.remove(AUTH_DETAILS_COOKIE);
  return {
    type: HANDLE_SIGN_OUT,
  };
};

export const signInUsingOAuth = (googleAuth) => async (dispatch) => {
  if (googleAuth && !googleAuth.isSignedIn.get()) {
    googleAuth
      .signIn(JSON.parse(googleAuth.currentUser.get().getId()))
      .then(async () => {
        if (googleAuth.isSignedIn.get()) {
          dispatch({
            type: HANDLE_GOOGLE_AUTH_SIGN_IN,
            payload: {
              firstName: googleAuth.currentUser
                .get()
                .getBasicProfile()
                .getGivenName(),
              oAuth: googleAuth,
            },
          });
          history.push('/');
        }
      });
  }
};

export const signOutUsingOAuth = (googleAuth) => async (dispatch) => {
  if (googleAuth && googleAuth.isSignedIn.get()) {
    googleAuth.signOut().then(() => {
      if (!googleAuth.isSignedIn.get()) {
        dispatch({
          type: HANDLE_GOOGLE_AUTH_SIGN_OUT,
          payload: null,
        });
      }
    });
  }
};

export const signUp = (formValues) => async (dispatch) => {
  const response = await authServiceAPI
    .post('/signup', {
      username: formValues.username,
      password: formValues.password,
      firstname: formValues.firstName,
      lastname: formValues.lastName,
      email: formValues.email.toLowerCase(),
    })
    .catch((err) => {
      dispatch({ type: HANDLE_SIGN_UP_ERROR, payload: err.message });
    });

  if (response) {
    if (response.data.account_creation_status === 'success') {
      history.push('/signin');
    } else {
      dispatch({
        type: HANDLE_SIGN_UP_ERROR,
        payload: response.data.error_msg,
      });
    }
  }
};

export const sendPaymentToken = (token) => async (dispatch) => {
  if (!token || (token && !token.hasOwnProperty('id'))) {
    dispatch({
      type: PAYMENT_RESPONSE_ERROR,
      payload: { errorMsg: 'Unable to fetch token. Try again later' },
    });
  }

  let url;
  if (process.env.REACT_APP_PAYMENT_SERVICE_URL) {
    url = `${process.env.REACT_APP_PAYMENT_SERVICE_URL}/payment`;
  } else {
    url = `http://localhost:${process.env.REACT_APP_PAYMENT_SERVICE_PORT}/payment`;
  }

  let config = {
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(token),
  };

  axios(config)
    .then(function (response) {
      let paymentResponse = {
        ...response.data,
        last4: token.card.last4,
        exp_year: token.card.exp_year,
        exp_month: token.card.exp_month,
        brand: token.card.brand,
      };

      if (paymentResponse.payment_failed) {
        history.push(`/checkout/cancel-payment/${response.data.charge_id}`);
      } else {
        history.push(`/checkout/success-payment/${response.data.charge_id}`);
        Cookies.remove(CART_TOTAL_COOKIE);
        Cookies.remove(SHOPPERS_PRODUCT_INFO_COOKIE);
      }

      dispatch({
        type: PAYMENT_RESPONSE,
        payload: { ...paymentResponse, error: false, errorMsg: null },
      });
    })
    .catch(function (error) {
      dispatch({
        type: PAYMENT_RESPONSE_ERROR,
        payload: { errorMsg: 'Something Went Wrong' },
      });
    });
};

export const getDataViaAPI = (type, uri, query) => async (dispatch) => {
  if (uri) {
    if (query) {
      uri += query;
    }

    let responseError = false;
    const response = await commonServiceAPI.get(uri).catch((err) => {
      dispatch({
        type: type,
        payload: { isLoading: false, statusCode: INTERNAL_SERVER_ERROR_CODE },
      });
      responseError = true;
    });

    if (responseError) {
      return;
    }

    if (response != null) {
      let payload = {
        isLoading: false,
        data: JSON.parse(JSON.stringify(response.data)),
      };
      if (query) {
        dispatch({
          type: type,
          payload: { ...payload, query: query },
        });
      } else {
        dispatch({
          type: type,
          payload: payload,
        });
      }

      if (
        LOAD_FILTER_PRODUCTS.localeCompare(type) === 0 &&
        window.location.search.localeCompare(uri.split('/products')[1]) !== 0
      ) {
        history.push(uri);
      }
    } else {
      dispatch({
        type: type,
        payload: { isLoading: false, statusCode: BAD_REQUEST_ERROR_CODE },
      });
    }
  }
};

export const loadFilterAttributes = (filterQuery) => async (dispatch) => {
  if (filterQuery) {
    let uri = `/filter${filterQuery}`;
    const response = await commonServiceAPI.get(uri);
    if (response != null) {
      dispatch({
        type: LOAD_FILTER_ATTRIBUTES,
        payload: JSON.parse(
          JSON.stringify({
            ...response.data,
            query: filterQuery.slice(3),
          }),
        ),
      });

      return JSON.parse(JSON.stringify(response.data));
    }
  }
};

export const getSearchSuggestions = (prefix) => async (dispatch) => {
  if (prefix) {
    let responseError = false;
    const uri = SEARCH_SUGGESTION_API + prefix;
    const response = await searchSuggestionServiceAPI.get(uri).catch((err) => {
      dispatch({ type: SEARCH_KEYWORD_ERROR });
      responseError = true;
    });

    if (responseError) {
      return;
    }

    dispatch({
      type: SEARCH_KEYWORD,
      payload: { data: JSON.parse(JSON.stringify(response.data)) },
    });
  }
};

export const setDefaultSearchSuggestions = () => async (dispatch) => {
  let responseError = false;
  const response = await searchSuggestionServiceAPI
    .get(DEFAULT_SEARCH_SUGGESTION_API)
    .catch((err) => {
      dispatch({ type: SEARCH_KEYWORD_ERROR });
      responseError = true;
    });

  if (responseError) {
    return;
  }

  dispatch({
    type: SEARCH_KEYWORD,
    payload: { data: JSON.parse(JSON.stringify(response.data)) },
  });
};
