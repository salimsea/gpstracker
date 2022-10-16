import React from 'react';
import {View} from 'react-native';

const Gap = ({height, width, color}) => {
  return (
    <View style={{height: height, width: width, backgroundColor: color}}></View>
  );
};

export default Gap;
