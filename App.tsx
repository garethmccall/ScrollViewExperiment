import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	Platform,
	NativeSyntheticEvent,
	NativeScrollEvent,
	FlatList,
	SectionList,
	SectionListRenderItem,
	SectionListData,
	SectionListRenderItemInfo,
	Dimensions,
	StatusBar,
	Animated,
} from 'react-native';
var loremIpsum = require('lorem-ipsum-react-native'),
	output = loremIpsum();

interface State {}

type OuterListSectionItem = { text: string; key: string };

interface OuterListSection {
	title: string;
	data: ReadonlyArray<OuterListSectionItem>;
}

interface InnerListItem {
	text: string;
	key: string;
}

const d = Dimensions.get('window');

const SEARCH_BAR_HEIGHT = 24;
const INTRO_BANNER_HEIGHT = 250;
const STATUS_BAR_HEIGHT = 20;

export default class App extends Component<{}, State> {
	scrollY = new Animated.Value(0);

	createOuterSections = () => [
		{
			title: 'header_section',
			data: [{ text: '', key: 'header_section_item_0' }],
		},
		...this.createInnerSections(),
	];

	renderOuterItem = (info: SectionListRenderItemInfo<OuterListSectionItem>) => {
		if (info.section.title === 'header_section') {
			return (
				<View
					style={{ backgroundColor: '#00AAFF', height: INTRO_BANNER_HEIGHT }}
				/>
			);
		}
		return (
			<View style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
				<Text>{info.item.text}</Text>
			</View>
		);
	};

	renderOuterHeader = (info: {
		section: SectionListData<OuterListSectionItem>;
	}) => {
		if (info.section.title === 'header_section') return null;
		return (
			<View
				style={{
					paddingHorizontal: 8,
					paddingVertical: 4,
					backgroundColor: '#CCCCCC',
				}}>
				<Text>{info.section.title}</Text>
			</View>
		);
	};

	createInnerSections = () => {
		const sections = [];
		for (let i = 0; i < 8; ++i) {
			const items = [];
			for (let j = 0; j < 4; ++j) {
				items.push({
					text: loremIpsum({
						count: 1,
						units: 'paragraphs',
					}),
					key: `section_${i}_item_${j}`,
				});
			}
			sections.push({
				title: `${i}`,
				data: items,
			});
		}
		return sections;
	};

	renderFloatingSearchBar = () => {
		return (
			<Animated.View
				style={{
					position: 'absolute',
					top: this.scrollY.interpolate({
						inputRange: [-d.height, 0, INTRO_BANNER_HEIGHT],
						outputRange: [
							STATUS_BAR_HEIGHT + INTRO_BANNER_HEIGHT + d.height,
							STATUS_BAR_HEIGHT + INTRO_BANNER_HEIGHT,
							STATUS_BAR_HEIGHT,
						],
						extrapolate: 'clamp',
					}),
					left: 0,
					right: 0,
					height: SEARCH_BAR_HEIGHT,
					backgroundColor: '#00FF00',
				}}
			/>
		);
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Animated.View style={{}}>
					<SectionList
						style={{ marginTop: SEARCH_BAR_HEIGHT }}
						sections={this.createOuterSections()}
						renderItem={this.renderOuterItem}
						renderSectionHeader={this.renderOuterHeader}
						scrollEventThrottle={16}
						onScroll={Animated.event(
							[{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
							{ useNativeDriver: false },
						)}
					/>
				</Animated.View>
				{this.renderFloatingSearchBar()}
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		padding: 10,
	},
});
