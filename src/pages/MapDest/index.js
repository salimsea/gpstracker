import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, fonts} from '../../utils';
import {Gap} from '../../components';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Button, TextInput} from 'react-native-paper';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {setFormGlobal} from '../../config/redux/action/globalAction';

let TOKEN =
  'sk.eyJ1Ijoic2FsaW1zZWEiLCJhIjoiY2w5YWkxMDh4MGpubzNwcXQ3djZtNWh6ZCJ9.eX-5i80byvpA4mNgMBbXzg';
MapboxGL.setAccessToken(TOKEN);

const MapDest = ({navigation}) => {
  const dispatch = useDispatch();
  const [titikCenter, setTitikCenter] = useState([
    106.80024559462458, -6.5305088365218324,
  ]);
  const [zoomCam, setZoomCam] = useState(16);
  const [isLokTujuan, setIsLokTujuan] = useState(false);
  const [lokTujuan, setLokTujuan] = useState([
    106.80024559462458, -6.5305088365218324,
  ]);
  const [teksLokTujuan, setTeksLokTujuan] = useState(false);
  const [namaLokTujuan, setNamaLokTujuan] = useState('');

  const onTextLokTujuan = lokasi => {
    setNamaLokTujuan(lokasi);
    if (lokasi !== '') {
      axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lokasi}.json?country=id&access_token=${TOKEN}`,
        )
        .then(res => {
          let data = res.data;
          setTeksLokTujuan(data.features);
        });
    } else {
      setTeksLokTujuan(false);
    }
  };

  const btnLokTujuan = (x, y, name) => {
    setLokTujuan([x, y]);
    setTitikCenter([x, y]);
    setTeksLokTujuan(false);
    setNamaLokTujuan(name);
    setZoomCam(16);
    setIsLokTujuan(true);
  };

  const btnSet = () => {
    dispatch(setFormGlobal('LatlonDest', lokTujuan));
    dispatch(setFormGlobal('NamaDest', namaLokTujuan));
    navigation.goBack();
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={{paddingHorizontal: 20, paddingVertical: 20}}>
          {/* section header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View>
              <Icon name="arrow-left-thin" size={30} color="#000" />
            </View>
            <View style={{paddingLeft: 10}}>
              <Text
                style={{
                  fontFamily: fonts.primary[600],
                  color: '#000',
                  fontSize: 16,
                }}>
                Tujuan Lokasi
              </Text>
            </View>
          </View>
          {/* section search */}
          <View style={{paddingTop: 15}}>
            <Text style={{paddingBottom: 10}}>Cari Lokasi :</Text>
            <TextInput
              style={{height: 40}}
              placeholder="Ketikkan Alamat..."
              onChangeText={e => onTextLokTujuan(e)}
              value={namaLokTujuan}
            />
            {teksLokTujuan ? (
              <>
                <Text style={{fontSize: 13, color: '#000', top: 5}}>
                  Result Pencarian :
                </Text>
                <ScrollView
                  style={{
                    maxHeight: 150,
                    backgroundColor: '#EEE',
                    marginTop: 10,
                  }}>
                  {teksLokTujuan.length !== 0 ? (
                    teksLokTujuan.map((v, i) => {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            btnLokTujuan(v.center[0], v.center[1], v.place_name)
                          }
                          key={i}
                          style={{
                            borderBottomColor: '#9c9a9a',
                            borderBottomWidth: 0.5,
                            padding: 10,
                          }}>
                          <Text style={{fontSize: 15, color: '#000'}}>
                            {v.place_name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <Text>data tidak ada</Text>
                  )}
                </ScrollView>
              </>
            ) : null}

            <Gap height={20} />
            <Button
              icon="google-maps"
              mode="contained"
              onPress={() => btnSet()}>
              Pilih Lokasi
            </Button>
          </View>
        </View>

        {/* section map */}
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
            animationMode="easeTo"
            minZoomLevel={20}
            animationDuration={1000}
          />
          <MapboxGL.PointAnnotation coordinate={lokTujuan}>
            <View>
              <Icon
                name="map-marker"
                size={35}
                color="#FF565D"
                style={{transform: [{rotate: '60deg'}]}}
              />
            </View>
          </MapboxGL.PointAnnotation>
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

export default MapDest;

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
