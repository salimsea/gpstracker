import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {Button} from 'react-native-paper';
import {Gap} from '../../components';
import {ICPoint} from '../../assets';
import notifee, {
  AndroidColor,
  AndroidImportance,
  EventType,
} from '@notifee/react-native';
import {colors} from '../../utils';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

let TOKEN =
  'sk.eyJ1Ijoic2FsaW1zZWEiLCJhIjoiY2w5YWkxMDh4MGpubzNwcXQ3djZtNWh6ZCJ9.eX-5i80byvpA4mNgMBbXzg';
MapboxGL.setAccessToken(TOKEN);

const Home = ({navigation, route}) => {
  const [corcenStart, setCorcenStart] = useState([
    106.80024559462458, -6.5305088365218324,
  ]);
  const [titikCenter, setTitikCenter] = useState([
    106.80024559462458, -6.5305088365218324,
  ]);
  const [zoomCam, setZoomCam] = useState(16);
  const [routeShape, setRouteShape] = useState({
    route: {
      type: 'FeatureCollection',
      features: [],
    },
  });
  const [startDriving, setStartDriving] = useState(false);
  const {formGlobal} = useSelector(state => state.globalReducer);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (formGlobal?.NamaDest) {
      btnDirection(corcenStart, formGlobal?.LatlonDest, false);
    }
  }, [isFocused]);

  useEffect(() => {
    Geolocation.getCurrentPosition(location => {
      setCorcenStart([location?.coords?.longitude, location?.coords?.latitude]);
      setTitikCenter([location?.coords?.longitude, location?.coords?.latitude]);
    });
    Geolocation.watchPosition(
      async location => {
        notifee.registerForegroundService(notification => {
          return new Promise(() => {
            notifee.onForegroundEvent(({type, detail}) => {
              if (
                type === EventType.ACTION_PRESS &&
                detail.pressAction.id === 'stopGps'
              ) {
                btnStop();
              }
            });
          });
        });

        await notifee.displayNotification({
          id: 'default',
          title: 'Driving Mode 🚗',
          body: `Aplikasi sedang berjalan`,
          android: {
            channelId: 'suara1',
            asForegroundService: true,
            color: AndroidColor.RED,
            colorized: true,
            importance: AndroidImportance.HIGH,
            actions: [
              {
                title: 'Stop',
                pressAction: {id: 'stopGps'},
              },
            ],
            pressAction: {
              id: 'default',
              mainComponent: 'App',
            },
          },
        });
      },
      err => {
        console.log(err);
      },
      {
        maximumAge: 3600000,
      },
    );
  }, []);

  useEffect(() => {
    if (startDriving) {
      const interval = setInterval(() => {
        console.log('running driving');
        Geolocation.getCurrentPosition(
          async location => {
            setCorcenStart([
              location?.coords?.longitude,
              location?.coords?.latitude,
            ]);
            btnDirection(
              [location?.coords?.longitude, location?.coords?.latitude],
              [formGlobal.LatlonDest[0], formGlobal.LatlonDest[1]],
              true,
            );
          },
          err => {
            console.log(err);
          },
          {
            maximumAge: 3600000,
          },
        );
      }, 2000);

      return () => clearInterval(interval);
    } else {
      return () => clearInterval();
    }
  }, [startDriving]);

  const btnStart = () => {
    if (!formGlobal?.NamaDest) {
      alert('Pilih lokasi tujuan kamu dulu ya');
      return;
    }
    setStartDriving(true);
  };

  const btnStop = async () => {
    setStartDriving(false);
    await notifee.stopForegroundService();
    // setRouteShape({
    //   route: {
    //     type: 'FeatureCollection',
    //     features: [],
    //   },
    // });
    btnDirection(corcenStart, formGlobal?.LatlonDest, false);
  };

  const btnDirection = (startLoc, destLoc, isRun = false) => {
    var URL = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${startLoc[0]},${startLoc[1]};${destLoc[0]},${destLoc[1]}?annotations=maxspeed&overview=full&geometries=geojson&access_token=${TOKEN}`;
    axios.get(URL).then(res => {
      let data = res.data;
      setRouteShape({
        route: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: data.routes[0].geometry.coordinates,
              },
            },
          ],
        },
      });
      if (!isRun) setTitikCenter(FUNCKorCen([startLoc, destLoc]));
      if (isRun) setTitikCenter(startLoc);
      FUNCZoomCam(data.routes[0].distance, isRun && 2);
    });
  };

  const FUNCKorCen = coord => {
    var result = coord.reduce(
      function (x, y) {
        return [
          x[0] - 0.0002 + y[0] / coord.length,
          x[1] + y[1] / coord.length,
        ];
      },
      [0.000021, -0.001],
      // [0, 0],
    );
    return result;
  };
  const FUNCZoomCam = (distance, toleran = 0) => {
    console.log('distance', distance);
    if (distance >= 1234392.25) {
      setZoomCam(4 + (toleran != 0 && toleran + 13));
      // console.log('0');
      return;
    }
    if (distance >= 188386.109) {
      setZoomCam(6 + (toleran != 0 && toleran + 9));
      // console.log('0');
      return;
    }
    if (distance >= 78271.484) {
      setZoomCam(8 + (toleran != 0 && toleran + 9));
      // console.log('0');
      return;
    }
    // if (distance >= 64000.742) {
    //   setZoomCam(10 + (toleran != 0 && toleran + 7));
    //   // console.log('1');
    //   return;
    // }
    if (distance >= 39135.742) {
      setZoomCam(9 + (toleran != 0 && toleran + 8));
      // console.log('1');
      return;
    }
    if (distance >= 19567.871) {
      setZoomCam(10 + (toleran != 0 && toleran + 7));
      // console.log('2');
      return;
    }
    if (distance >= 9783.936) {
      setZoomCam(11 + (toleran != 0 && toleran + 6));
      // console.log('3');
      return;
    }
    if (distance >= 4891.968) {
      setZoomCam(12 + (toleran != 0 && toleran + 5));
      // console.log('4');
      return;
    }
    if (distance >= 2445.984) {
      setZoomCam(13 + toleran);
      // console.log('5');
      return;
    }
    if (distance >= 1222.992) {
      setZoomCam(14 + toleran);
      // console.log('6');
      return;
    }
    if (distance >= 611.496) {
      setZoomCam(15 + toleran);
      // console.log('7');
      return;
    }
    if (distance >= 305.748) {
      setZoomCam(16 + toleran);
      // console.log('8');
      return;
    }
    if (distance >= 152.874) {
      setZoomCam(17 + toleran);
      // console.log('9');
      return;
    }
    if (distance >= 76.437) {
      setZoomCam(18 + toleran);
      // console.log('10');
      return;
    }
    if (distance >= 38.218) {
      setZoomCam(19 + toleran);
      // console.log('11');
      return;
    }
    if (distance >= 19.109) {
      setZoomCam(20 + toleran);
      // console.log('12');
      return;
    }
    if (distance >= 9.555) {
      setZoomCam(20 + toleran);
      // console.log('13');
      return;
    }
    if (distance >= 4.777) {
      setZoomCam(20 + toleran);
      // console.log('14');
      return;
    }
    if (distance >= 2.389) {
      setZoomCam(15 + toleran);
      // console.log('15');
      return;
    }
    if (distance >= 1.194) {
      setZoomCam(23 + toleran);
      // console.log('16');
      return;
    }
    if (distance >= 0.597) {
      setZoomCam(17 + toleran);
      // console.log('17');
      return;
    }
    if (distance >= 0.299) {
      setZoomCam(18 + toleran);
      // console.log('18');
      return;
    }
    if (distance >= 0.149) {
      setZoomCam(19 + toleran);
      // console.log('19');
      return;
    }
    if (distance >= 0.075) {
      setZoomCam(20 + toleran);
      // console.log('20');
      return;
    }
    if (distance >= 0.037) {
      setZoomCam(21 + toleran);
      // console.log('21');
      return;
    }
    if (distance >= 0.019) {
      setZoomCam(22 + toleran);
      // console.log('22');
      return;
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          scaleBarEnabled={false}
          animated
          logoEnabled={false}
          compassEnabled
          compassPosition={{top: 10, right: 8}}>
          <MapboxGL.Camera
            zoomLevel={zoomCam}
            centerCoordinate={titikCenter}
            animationMode="moveTo"
            minZoomLevel={20}
            animationDuration={800}
          />
          <MapboxGL.ShapeSource id="line1" shape={routeShape.route}>
            <MapboxGL.LineLayer
              id="linelayer1"
              style={{
                lineColor: '#2192FF',
                lineWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
                lineWidth: 3.2,
                lineOpacity: 0.84,
              }}
            />
          </MapboxGL.ShapeSource>
          <MapboxGL.PointAnnotation coordinate={corcenStart}>
            <View style={{transform: [{rotateX: '20deg'}]}}>
              <ICPoint
                width="45"
                height="45"
                style={{transform: [{rotateY: '20deg'}]}}
              />
            </View>
          </MapboxGL.PointAnnotation>
          {formGlobal?.LatlonDest && (
            <MapboxGL.PointAnnotation coordinate={formGlobal?.LatlonDest}>
              <View>
                <Icon name="map-marker" size={35} color="#FF565D" />
              </View>
            </MapboxGL.PointAnnotation>
          )}
        </MapboxGL.MapView>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 20,
          }}>
          <View
            style={{
              borderRadius: 10,
              marginHorizontal: 20,
              padding: 20,
              backgroundColor: 'white',
            }}>
            {!startDriving ? (
              <>
                <View>
                  <Text style={{marginBottom: 10}}>Tempat Penjemputan</Text>
                  <View
                    style={{
                      height: 40,
                      backgroundColor: colors.grey2,
                      borderRadius: 5,
                      padding: 10,
                    }}>
                    <Text>Lokasi saat ini</Text>
                  </View>
                </View>
                <Gap height={10} />
                <View>
                  <Text style={{marginBottom: 10}}>Tujuan Lokasi</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('MapDest')}
                    style={{
                      height: 40,
                      backgroundColor: colors.grey2,
                      borderRadius: 5,
                      padding: 10,
                    }}>
                    <Text numberOfLines={1}>
                      {formGlobal?.NamaDest || 'Pilih lokasi dulu....'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Gap height={20} />
                <Button icon="car" mode="contained" onPress={() => btnStart()}>
                  Mulai Perjalanan
                </Button>
              </>
            ) : (
              <Button
                icon="stop"
                mode="contained"
                color="red"
                onPress={() => btnStop()}>
                Stop
              </Button>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
});
