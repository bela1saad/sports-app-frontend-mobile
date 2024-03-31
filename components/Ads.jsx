import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.9;

const Ads = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const [autoplayInterval, setAutoplayInterval] = useState(5000); // Auto-scroll interval

  const ads = [
    { imageUrl: "https://source.unsplash.com/random/600x400?sig=1" },
    { imageUrl: "https://source.unsplash.com/random/600x400?sig=2" },
    { imageUrl: "https://source.unsplash.com/random/600x400?sig=3" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      scrollToIndex(activeIndex + 1);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const renderAdItem = ({ item }) => (
    <TouchableOpacity onPress={() => console.log("Ad clicked")}>
      <Image source={{ uri: item.imageUrl }} style={styles.adImage} />
    </TouchableOpacity>
  );

  const scrollToIndex = (index) => {
    const newIndex = index >= 0 ? index % ads.length : ads.length - 1;
    setActiveIndex(newIndex);
    flatListRef.current.scrollToIndex({
      animated: true,
      index: newIndex,
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const renderPagination = () => {
    return ads.map((_, index) => (
      <View
        key={index}
        style={[
          styles.paginationDot,
          { backgroundColor: activeIndex === index ? "#05a759" : "#888" },
        ]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ads.concat(ads)} // Duplicate the ads array to create a loop
        renderItem={renderAdItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={1}
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />
      <View style={styles.paginationContainer}>{renderPagination()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  adImage: {
    width: ITEM_WIDTH,
    aspectRatio: 3 / 2,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Ads;
