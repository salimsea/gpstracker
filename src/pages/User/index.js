import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fonts} from '../../utils';

const User = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontFamily: fonts.primary['custom'], fontSize: 30}}>
        User
      </Text>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({});
