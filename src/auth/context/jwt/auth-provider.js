'use client';

import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
import jwtDecode from 'jwt-decode';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken =
          typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('authToken')) : '';

        console.log('ACCESS TOKEN');
        console.log(accessToken);

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/token/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: accessToken.refresh }),
        });

        let data = await response.json();

        if (response.status === 200) {
          // setAuthTokens(data)
          const user = jwtDecode(data.access);
          localStorage.setItem('authToken', JSON.stringify(data));

          dispatch({
            type: 'INITIAL',
            payload: {
              user,
            },
          });
        } else {
          dispatch({
            type: 'INITIAL',
            payload: {
              user: null,
            },
          });
        }

        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/token`);
        // const { user } = response.data;
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  // const initialize = useCallback(async () => {
  //   try {
  //     // const accessToken = sessionStorage.getItem(STORAGE_KEY);
  //     const accessToken = sessionStorage.getItem(accessToken);

  //     if (accessToken && isValidToken(accessToken)) {
  //       setSession(accessToken);

  //       alert('access token valid');

  //       const response = await axios.get(endpoints.auth.me);

  //       const { user } = response.data;

  //       dispatch({
  //         type: 'INITIAL',
  //         payload: {
  //           user,
  //         },
  //       });
  //     } else {
  //       alert('access token invalid');
  //       dispatch({
  //         type: 'INITIAL',
  //         payload: {
  //           user: null,
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.error('probably expired', error);
  //     dispatch({
  //       type: 'INITIAL',
  //       payload: {
  //         user: null,
  //       },
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   initialize();
  // }, [initialize]);

  // LOGIN
  const login = async (username, password) => {
    // alert(username, password);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/token/`, {
      username,
      password,
    });

    const { access, refresh } = response.data;

    const user = jwtDecode(response.data.access);
    console.log('USER', user);

    console.log(access);
    console.log(response.data);
    localStorage.setItem('authToken', JSON.stringify(response.data));
    localStorage.setItem('refreshToken', 'refresh');
    localStorage.setItem('Token', '');
    // setSession(access);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
