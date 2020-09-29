import React, { PureComponent } from 'react';
import { LayoutAnimation, Text, View, UIManager, Platform } from 'react-native';
import { INTRO_BANNER_HEIGHT } from './constants';

export default class IntroView extends PureComponent {
	componentWillUnmount() {
		this.collapseRow();
	}

	collapseRow = () => {
		if (Platform.OS === 'android') {
			UIManager.setLayoutAnimationEnabledExperimental?.(true);
		}
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	};

	render() {
		return (
			<View
				style={{
					backgroundColor: '#00AAFF',
					height: INTRO_BANNER_HEIGHT,
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<Text style={{ fontSize: 32 }}>HelloWorld</Text>
			</View>
		);
	}
}
