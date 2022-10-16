/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import Geolocation from 'react-native-geolocation-service';

notifee.onForegroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  if (type === EventType.ACTION_PRESS) {
    console.log(pressAction.id);
    if (pressAction.id === 'stopGps' || type === EventType.PRESS) {
      await notifee.stopForegroundService();
    }
    return;
  }
  // switch (type) {
  //   case EventType.DISMISSED:
  //     console.log('User dismissed notification', detail.notification);
  //     break;
  //   case EventType.PRESS:
  //     await notifee.stopForegroundService();

  //     break;
  // }
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  // const {notification, pressAction} = detail;
  // console.log(notification);
  //   onTaskUpdate(task => {
  //     if (task.update) {
  //       notifee.displayNotification({
  //         id: notification.id,
  //         body: notification.body,
  //         android: {
  //           ...notification.android,
  //           progress: {
  //             max: task.update.total,
  //             current: task.update.current,
  //           },
  //         },
  //       });
  //     }
  //     // if (task.complete) {
  //     //   await notifee.stopForegroundService()
  //     // }
  //   });
  //   await notifee.stopForegroundService();
  //   await notifee.displayNotification({
  //     id: 'dashkj3',
  //     title: 'Location Pinned',
  //     body: notification?.body,
  //     android: {
  //       channelId: 'suara1',
  //       asForegroundService: true,
  //       color: AndroidColor.RED,
  //       colorized: true,
  //     },
  //   });
});

AppRegistry.registerComponent(appName, () => App);
