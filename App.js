import React, { useReducer, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SignInScreen from './screens/SignInScreen';
import SplashScreen from './screens/SplashScreen';
import NeighborhoodsScreen from './screens/NeighborhoodsScreen';
import Constants from 'expo-constants';
import * as firebase from 'firebase';
import AuthContext from './contexts/auth-context';

if (!firebase.apps.length) {
  firebase.initializeApp(Constants.manifest.extra.firebaseConfig);
}

const Stack = createStackNavigator();

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            loginErrors: null,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            loginErrors: null,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            loginErrors: null,
          };
        case 'LOGIN_ERRORS':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            loginErrors: action.errors,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      loginErrors: null,
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (credentials) => {
        await firebase
          .auth()
          .signInWithEmailAndPassword(credentials.email, credentials.password)
          .then((data) => {
            dispatch({ type: 'SIGN_IN', token: data.stsTokenManager });
          })
          .catch(function (error) {
            const errorMessage = error.message;

            dispatch({ type: 'LOGIN_ERRORS', errors: errorMessage });
          });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {state.isLoading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            <Stack.Screen
              title="Ingresar"
              name="SignIn"
              component={SignInScreen}
            />
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="Neighborhoods"
                component={NeighborhoodsScreen}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
