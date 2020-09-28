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
	LayoutChangeEvent,
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
const INTRO_BANNER_HEIGHT = 220;
const STATUS_BAR_HEIGHT = 20;

export default class App extends Component<{}, State> {
	scrollY = new Animated.Value(0);
	headerHeight = 0;

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
				<React.Fragment>
					<View
						onLayout={(event: LayoutChangeEvent) => {
							this.headerHeight = event.nativeEvent.layout.height;
							this.forceUpdate();
						}}
						style={{
							backgroundColor: '#00AAFF',
							height: INTRO_BANNER_HEIGHT,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Text style={{ fontSize: 32 }}>HelloWorld</Text>
					</View>
					<View style={{ height: SEARCH_BAR_HEIGHT }} />
				</React.Fragment>
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
					backgroundColor: '#CCCCCC',
					paddingHorizontal: 8,
					paddingVertical: 4,
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
						inputRange: [-d.height, 0, this.headerHeight],
						outputRange: [this.headerHeight + d.height, this.headerHeight, 0],
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
				<Animated.View
					style={{
						marginTop: this.scrollY.interpolate({
							inputRange: [
								0,
								this.headerHeight,
								this.headerHeight + SEARCH_BAR_HEIGHT,
							],
							outputRange: [0, 0, SEARCH_BAR_HEIGHT],
							extrapolate: 'clamp',
							// easing: (input: number) => Math.min(input, SEARCH_BAR_HEIGHT),
						}),
					}}>
					<SectionList
						sections={this.createOuterSections()}
						renderItem={this.renderOuterItem}
						renderSectionHeader={this.renderOuterHeader}
						scrollEventThrottle={16}
						stickySectionHeadersEnabled
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
		marginTop: STATUS_BAR_HEIGHT,
	},
});
