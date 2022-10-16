import React, {useEffect} from 'react';
import OneSignal from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {navigationRef, OneSignalInit, store} from './config';
import {NavigationContainer} from '@react-navigation/native';
import Routers from './routers';

OneSignalInit();
IgnoreLog();

const App = () => {
  useEffect(() => {
    async function fetchData() {
      const deviceState = await OneSignal.getDeviceState();
      console.log('token onesignal : ', deviceState.userId);
      SplashScreen.hide();
    }
    fetchData();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Routers />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
