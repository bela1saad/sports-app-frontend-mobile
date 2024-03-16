import React, { useState, useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import Carousel from "react-native-snap-carousel";

const { width, height } = Dimensions.get("window");

const Ads = () => {
  const ads = [
    { imageUrl: "https://source.unsplash.com/random/600x400?sig=1" },
    { imageUrl: "https://source.unsplash.com/random/600x400?sig=2" },
    { imageUrl: "https://source.unsplash.com/random/600x400?sig=3" },
  ];

  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderAdItem = ({ item }) => (
    <TouchableOpacity onPress={() => console.log("Ad clicked")}>
      <Image source={{ uri: item.imageUrl }} style={styles.adImage} />
    </TouchableOpacity>
  );

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
      <Carousel
        ref={carouselRef}
        data={ads}
        renderItem={renderAdItem}
        autoplay={true}
        loop={true}
        autoplayInterval={5000}
        sliderWidth={width * 0.9}
        itemWidth={width * 0.9}
        onSnapToItem={(index) => setActiveIndex(index)}
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
    width: "100%",
    aspectRatio: 3 / 2,
    borderRadius: 10,
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
