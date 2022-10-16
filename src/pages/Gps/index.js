import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState} from 'react';
import {Button, Switch} from 'react-native-paper';
import {fonts} from '../../utils';
import {Gap} from '../../components';
import Geolocation from 'react-native-geolocation-service';
import notifee, {AndroidColor, AndroidImportance} from '@notifee/react-native';
import Home from '../Home';
import {ICPoint} from '../../assets';
import Icon from 'react-native-vector-icons/FontAwesome';

const Gps = ({navigation}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [location, setLocation] = useState(false);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const onPlay = () => {
    if (!isSwitchOn) start();
    if (isSwitchOn) stop();
  };

  const start = async () => {
    notifee.registerForegroundService(notification => {
      return new Promise(() => {
        // notifee.displayNotification({
        //   id: 'default',
        //   title: 'Location Pinned',
        //   body: `Wait for searching....`,
        //   android: {
        //     channelId: 'suara1',
        //     asForegroundService: true,
        //     color: AndroidColor.RED,
        //     colorized: true,
        //     actions: [
        //       {
        //         title: 'Stop',
        //         pressAction: {
        //           id: 'stop',
        //         },
        //       },
        //     ],
        //   },
        // });
      });
    });

    // Geolocation.watchPosition(
    //   async location => {
    //     setLocation(location);
    //     // console.log(
    //     //   `latitude : ${location?.coords?.latitude} || longitude : ${location?.coords?.longitude}`,
    //     // );

    //     await notifee.displayNotification({
    //       id: 'default',
    //       title: 'Location Pinned',
    //       body: `latitude : ${location?.coords?.latitude} || longitude : ${location?.coords?.longitude}`,
    //       android: {
    //         channelId: 'suara1',
    //         asForegroundService: true,
    //         color: AndroidColor.RED,
    //         colorized: true,
    //         importance: AndroidImportance.HIGH,
    //         actions: [
    //           {
    //             title: 'Stop',
    //             pressAction: {id: 'stopGps'},
    //           },
    //         ],
    //       },
    //     });
    //   },
    //   err => {
    //     console.log(err);
    //   },
    //   {
    //     interval: 3000,
    //   },
    // );
  };
  const stop = async () => {
    await notifee.stopForegroundService();
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <View style={{alignItems: 'center'}}>
          <Icon
            name="map-pin"
            size={25}
            color="#FF565D"
            style={{transform: [{rotate: '0deg'}]}}
          />
          <Gap height={20} />
          <Text style={{textAlign: 'center', fontFamily: fonts.primary[600]}}>
            Nyalakan GPS kamu yuk, supaya teman-teman kamu tau bahwa kamu berada
            dimana sekarang ini!!
          </Text>
          <Gap height={20} />
          <Switch
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
            onChange={() => onPlay()}
          />
          <Gap height={20} />
          {isSwitchOn ? (
            <Text
              style={{
                textAlign: 'center',
                fontFamily: fonts.primary[600],
                color: 'green',
              }}>
              Berhasil Nyala
            </Text>
          ) : (
            <Text
              style={{
                textAlign: 'center',
                fontFamily: fonts.primary[600],
                color: 'red',
              }}>
              Masih tidak aktif
            </Text>
          )}
        </View>
      </View>
      {isSwitchOn && (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            width: '100%',
            paddingHorizontal: 20,
          }}>
          <Button
            icon="navigation"
            mode="contained"
            onPress={() => navigation.navigate('Home')}>
            Kamu Siap Lanjut
          </Button>
        </View>
      )}
    </>
  );
};

export default Gps;

const styles = StyleSheet.create({});
