import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { FeedItem } from '../../types';
import { Palette } from '../../types';

interface Props {
  item: FeedItem;
  palette: Palette;
  isPlaying: boolean;
}

export default function VinylArt({ item, palette, isPlaying }: Props) {
  const rotation = useSharedValue(0);
  const ringRotation = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 8000, easing: Easing.linear }),
        -1,
        false
      );
      ringRotation.value = withRepeat(
        withTiming(360, { duration: 4000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
      cancelAnimation(ringRotation);
    }
  }, [isPlaying]);

  const discStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }],
  }));

  return (
    <View style={styles.frame}>
      <Animated.View style={[styles.ring, ringStyle]}>
        <View style={[styles.ringInner, { borderColor: palette.c1 }]} />
      </Animated.View>

      <Animated.View
        style={[styles.disc, { backgroundColor: palette.c3 }, discStyle]}
      >
        {[40, 60, 80].map((r) => (
          <View
            key={r}
            style={[
              styles.groove,
              {
                width: r * 2,
                height: r * 2,
                borderRadius: r,
                borderColor: 'rgba(255,255,255,0.04)',
              },
            ]}
          />
        ))}
        <View style={[styles.label, { backgroundColor: palette.c3 }]} />
      </Animated.View>

      <View style={[styles.glow, { shadowColor: palette.c1 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'absolute',
    top: '44%',
    left: '50%',
    marginLeft: -109,
    marginTop: -109,
    width: 218,
    height: 218,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  ring: {
    position: 'absolute',
    width: 224,
    height: 224,
    borderRadius: 112,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    position: 'absolute',
    width: 224,
    height: 224,
    borderRadius: 112,
    borderWidth: 2,
    opacity: 0.7,
  },
  disc: {
    width: 206,
    height: 206,
    borderRadius: 103,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 20,
  },
  groove: {
    position: 'absolute',
    borderWidth: 0.5,
  },
  label: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  glow: {
    position: 'absolute',
    width: 206,
    height: 206,
    borderRadius: 103,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 0,
  },
});
