import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export const LayoutStyles = StyleSheet.create({
  // Flex layouts
  flex1: {
    flex: 1,
  },

  flexRow: {
    flexDirection: 'row',
  },

  flexColumn: {
    flexDirection: 'column',
  },

  // Alignment
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerHorizontal: {
    alignItems: 'center',
  },

  centerVertical: {
    justifyContent: 'center',
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  spaceAround: {
    justifyContent: 'space-around',
  },

  alignEnd: {
    alignItems: 'flex-end',
  },

  alignStart: {
    alignItems: 'flex-start',
  },

  justifyEnd: {
    justifyContent: 'flex-end',
  },

  justifyStart: {
    justifyContent: 'flex-start',
  },

  // Common containers
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  contentContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // Positioning
  absolute: {
    position: 'absolute',
  },

  relative: {
    position: 'relative',
  },

  // Overflow
  hidden: {
    overflow: 'hidden',
  },

  // Full coverage
  fullCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
