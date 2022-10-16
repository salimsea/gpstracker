import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fonts} from '../../utils';

const Intro = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontFamily: fonts.primary['custom'], fontSize: 30}}>
        Intro
      </Text>
    </View>
  );
};

export default Intro;

const styles = StyleSheet.create({});
