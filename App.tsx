import React, { Component, isValidElement } from 'react';
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
	TextInput,
	TouchableWithoutFeedback,
	TouchableHighlightBase,
	LayoutAnimation,
	Easing,
} from 'react-native';
var loremIpsum = require('lorem-ipsum-react-native'),
	output = loremIpsum();

interface OuterListSection {
	title: string;
	data: InnerListItem[];
}

interface InnerListItem {
	text: string;
	key: string;
}

interface State {
	showBanner: boolean;
	sections: OuterListSection[];
	searchText: string;
	searchFieldFocused: boolean;
}

const d = Dimensions.get('window');

const SEARCH_BAR_HEIGHT = 42;
const INTRO_BANNER_HEIGHT = 220;
const STATUS_BAR_HEIGHT = d.height === 812 ? 44 : 20;

export default class App extends Component<{}, State> {
	searchBar = React.createRef<TextInput>();
	sectionList = React.createRef<SectionList>();
	scrollY = new Animated.Value(0);
	headerHeight = 0;
	items: InnerListItem[] = [];

	state = {
		showBanner: true,
		sections: [],
		searchText: '',
		searchFieldFocused: false,
	};

	componentDidMount() {
		this.items = this.createItems(45);
		this.setState({
			sections: this.createSections(this.items),
		});
	}

	createItems(count: number) {
		let items = [];
		for (let i = 0; i < count; ++i) {
			items.push({
				text: loremIpsum({ count: 3, units: 'words' }),
				key: `item_${i}`,
			});
		}
		items.sort((a, b) =>
			a.text.toLocaleUpperCase().localeCompare(b.text.toLocaleUpperCase()),
		);
		return items;
	}

	createSections = (items: InnerListItem[]) => {
		let sections: OuterListSection[] = [
			{
				title: 'header_section',
				data: [{ text: '', key: 'header_section_item_0' }],
			},
		];

		let currentLetter = '';
		let sectionIndex = 0;

		items.forEach((item: InnerListItem) => {
			const firstChar = item.text.charAt(0).toLocaleUpperCase();
			if (firstChar !== currentLetter) {
				currentLetter = firstChar;
				sections.push({ title: currentLetter, data: [] });
				++sectionIndex;
			}
			const section = sections[sectionIndex];
			section?.data.push(item);
		});

		return sections;
	};

	filterItems = (text: string) => {
		if (text.trim() === '') return this.items;

		const filteredItems = this.items.filter(item =>
			item.text.toLocaleUpperCase().includes(text.toLocaleUpperCase()),
		);

		return filteredItems;
	};

	onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		this.scrollY.setValue(event.nativeEvent.contentOffset.y);
	};

	onChangeText = (text: string) => {
		const filteredItems = this.filterItems(text);
		let sections = this.createSections(filteredItems);

		this.setState({
			sections,
			searchText: text,
		});
		// this.sectionList.current?.scrollToLocation({
		// 	sectionIndex: sections.length === 1 ? 0 : 1,
		// 	itemIndex: 0,
		// 	animated: true,
		// });
	};

	focusTextField = () => {
		this.searchBar.current?.focus();
	};

	onFocus = () => {
		this.setState({
			searchFieldFocused: true,
		});
		// this.sectionList.current?.scrollToLocation({
		// 	sectionIndex: this.state.sections.length === 1 ? 0 : 1,
		// 	itemIndex: 0,
		// 	animated: true,
		// });
	};

	onBlur = () => {
		this.setState({ searchFieldFocused: false });
	};

	renderItem = (info: SectionListRenderItemInfo<InnerListItem>) => {
		if (info.item.key === 'header_section_item_0') {
			return (
				<View>
					<View
						onLayout={(event: LayoutChangeEvent) => {
							this.headerHeight = event.nativeEvent.layout.height;
							this.forceUpdate();
						}}
						style={{
							backgroundColor: '#00AAFF',
							height: !this.state.searchFieldFocused ? INTRO_BANNER_HEIGHT : 0,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Text style={{ fontSize: 32 }}>HelloWorld</Text>
					</View>
					<Animated.View
						style={{
							height: this.scrollY.interpolate({
								inputRange: [
									0,
									this.headerHeight,
									this.headerHeight + SEARCH_BAR_HEIGHT,
								],
								outputRange: [SEARCH_BAR_HEIGHT, SEARCH_BAR_HEIGHT, 0],
								extrapolate: 'clamp',
								easing: Platform.OS === 'ios' ? Easing.step0 : undefined,
							}),
						}}
					/>
				</View>
			);
		}
		return (
			<View
				style={{
					paddingHorizontal: 8,
					paddingVertical: 4,
					borderBottomColor: '#cccccc',
					borderBottomWidth: 1,
					height: 32,
				}}>
				<Text>{info.item.text}</Text>
			</View>
		);
	};

	renderSectionHeader = (info: { section: SectionListData<InnerListItem> }) => {
		if (info.section.title === 'header_section') return null;
		return (
			<View
				style={{
					backgroundColor: '#CCCCCC',
					paddingHorizontal: 8,
					paddingVertical: 4,
					height: 24,
				}}>
				<Text>{info.section.title}</Text>
			</View>
		);
	};

	getSearchBarPosition = () =>
		this.scrollY.interpolate({
			inputRange: [-d.height, 0, this.headerHeight],
			outputRange: [this.headerHeight + d.height, this.headerHeight, 0],
			extrapolate: 'clamp',
		});

	renderFloatingSearchBar = () => {
		return (
			<Animated.View
				style={{
					position: 'absolute',
					top: this.getSearchBarPosition(),
					left: 0,
					right: 0,
					height: SEARCH_BAR_HEIGHT,
					backgroundColor: '#00FF00',
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: 8,
				}}>
				<Text>Search</Text>
				<View style={{ width: 8 }} />
				<View style={{ flex: 1, backgroundColor: 'white' }}>
					<TextInput
						style={{ padding: 4, textAlign: 'left' }}
						ref={this.searchBar}
						placeholder="Enter search terms here"
						value={this.state.searchText}
						onChangeText={this.onChangeText}
						onFocus={this.onFocus}
						onBlur={this.onBlur}
						autoCorrect={false}
						autoCapitalize="none"
					/>
				</View>
			</Animated.View>
		);
	};

	renderFloatingTouchable = () => {
		return (
			<TouchableWithoutFeedback onPress={this.focusTextField}>
				<Animated.View
					style={{
						position: 'absolute',
						top: this.getSearchBarPosition(),
						left: 0,
						right: 0,
						height: SEARCH_BAR_HEIGHT,
					}}
				/>
			</TouchableWithoutFeedback>
		);
	};

	render() {
		return (
			<SafeAreaView style={styles.container}>
				{this.renderFloatingSearchBar()}
				<Animated.View
					style={{
						flex: 1,
						marginTop: this.scrollY.interpolate({
							inputRange: [
								0,
								this.headerHeight,
								this.headerHeight + SEARCH_BAR_HEIGHT,
							],
							outputRange: [0, 0, SEARCH_BAR_HEIGHT],
							extrapolate: 'clamp',
							easing: Platform.OS === 'ios' ? Easing.step0 : undefined,
						}),
					}}>
					<SectionList
						ref={this.sectionList}
						sections={this.state.sections}
						renderItem={this.renderItem}
						renderSectionHeader={this.renderSectionHeader}
						scrollEventThrottle={32}
						stickySectionHeadersEnabled
						onScroll={Animated.event(
							[{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
							{ useNativeDriver: false },
						)}
					/>
				</Animated.View>
				{this.renderFloatingTouchable()}
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
