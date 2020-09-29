import { Dimensions } from 'react-native';

const d = Dimensions.get('window');

export const SEARCH_BAR_HEIGHT = 42;
export const INTRO_BANNER_HEIGHT = 220;
export const KEYBOARD_HEIGHT = 217;

export const STATUS_BAR_HEIGHT = d.height === 812 ? 44 : 20;
