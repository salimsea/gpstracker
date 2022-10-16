import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import {colors, fonts} from '../../../utils';
import Gap from '../Gap';

const TabItem = ({title, active, onPress, onLongPress}) => {
  return (
    <>
      <TouchableRipple
        style={styles.container}
        onPress={onPress}
        onLongPress={onLongPress}>
        <Text>{title}</Text>
      </TouchableRipple>
    </>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  container: {
    width: '20%',
    alignItems: 'center',
  },
  text: active => ({
    fontSize: 11,
    color: active ? colors.text.menuActive : colors.text.menuInactive,
    fontFamily: fonts.primary[800],
    marginTop: 2,
  }),
});
