import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Keyboard, Platform, Animated} from 'react-native';
import {TabItem} from '../../atoms';
import {colors} from '../../../utils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BottomNavigator = props => {
  const [offset, setOffset] = useState(new Animated.Value(0));

  useEffect(() => {
    let keyboardEventListeners;

    return () => {
      if (Platform.OS === 'android') {
        keyboardEventListeners &&
          keyboardEventListeners.forEach(eventListener =>
            eventListener.remove(),
          );
      }
    };
  }, []);

  const render = () => {
    // if (Platform.OS === 'ios') return <BottomTabItem {...props} />;
    return (
      <Animated.View style={styles.container}>
        <BottomTabItem {...props} />
      </Animated.View>
    );
  };

  return render();
};

const BottomTabItem = ({state, descriptors, navigation}) => {
  return (
    // <View style={styles.container}>
    state.routes.map((route, index) => {
      const {options} = descriptors[route.key];
      const label =
        options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

      const isFocused = state.index === index;

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name);
        }
      };

      const onLongPress = () => {
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        });
      };

      return (
        <TabItem
          key={index}
          title={label}
          active={isFocused}
          onPress={onPress}
          onLongPress={onLongPress}
        />
      );
    })
    // </View>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    elevation: 20,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderColor: '#D2D2D2',
    alignItems: 'flex-end',
    height: hp('7%'),
    width: '100%',
    borderTopWidth: 0.3,
    alignItems: 'center',
    marginVertical: Platform.select({ios: 4, android: 0}), // Prevent a random Android rendering issue
  },
});
