declare module 'react-native-vector-icons/FontAwesome5' {
  import { Icon } from 'react-native-vector-icons/Icon';
  import React from 'react';
  import { TextProps } from 'react-native';

  interface Props extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class FontAwesome5 extends React.Component<Props> {}
}
