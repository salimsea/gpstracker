import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useRef} from 'react';
import MapboxGL from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, fonts} from '../../utils';
import {Gap} from '../../components';
import {Button, TextInput} from 'react-native-paper';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {setFormGlobal} from '../../config/redux/action/globalAction';

let TOKEN =
  'sk.eyJ1Ijoic2FsaW1zZWEiLCJhIjoiY2w5YWkxMDh4MGpubzNwcXQ3djZtNWh6ZCJ9.eX-5i80byvpA4mNgMBbXzg';
MapboxGL.setAccessToken(TOKEN);

const MapDest = ({navigation}) => {
  var mapref = useRef(null);
  const dispatch = useDispatch();
  const [titikCenter, setTitikCenter] = useState([
    106.80024559462458, -6.5305088365218324,
  ]);
  const [zoomCam, setZoomCam] = useState(16);
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
  };

  const setPointCenter = async () => {
    const center = await mapref?.current?.getCenter();
    setLokTujuan(center);
    if (!namaLokTujuan) setNamaLokTujuan(`${center}`);
  };

  const btnSet = async () => {
    dispatch(setFormGlobal('LatlonDest', lokTujuan));
    dispatch(setFormGlobal('NamaDest', namaLokTujuan));
    navigation.goBack();
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        {/* section map */}
        <View style={{position: 'relative', width: '100%', height: '80%'}}>
          <MapboxGL.MapView
            ref={mapref}
            style={styles.map}
            scaleBarEnabled={false}
            animated
            attributionEnabled={false}
            logoEnabled={false}
            rotateEnabled={false}
            onRegionDidChange={() => setPointCenter()}
            regionWillChangeDebounceTime={1}
            regionDidChangeDebounceTime={1}
            showUserLocation={true}>
            <MapboxGL.Camera
              zoomLevel={zoomCam}
              centerCoordinate={titikCenter}
              animationMode="easeTo"
              minZoomLevel={20}
              animationDuration={1000}
              onUserTrackingModeChange={() => console.log('s')}
            />
          </MapboxGL.MapView>
          <View
            style={{
              position: 'absolute',
              top: '47%',
              right: '45.5%',
            }}>
            <Icon name="map-marker" size={35} color="#FF565D" />
          </View>
        </View>

        {/* section header */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            backgroundColor: colors.white,
            borderRadius: 30,
            padding: 10,
          }}>
          <View>
            <Icon name="arrow-left-thin" size={30} color={colors.black} />
          </View>
        </TouchableOpacity>

        {/* section search */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}>
          <View>
            <Text style={{paddingBottom: 10, color: colors.black}}>
              Cari Lokasi :
            </Text>
            <TextInput
              style={{height: 40}}
              placeholder="Ketikkan Alamat..."
              onChangeText={e => onTextLokTujuan(e)}
              value={namaLokTujuan}
            />
            {teksLokTujuan ? (
              <>
                <Text style={{fontSize: 13, color: colors.black, top: 5}}>
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
    backgroundColor: colors.white,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
});
