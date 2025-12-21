import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../styles/ProfileStyles";

const ProfileOption = React.memo(function ProfileOption({
  icon,
  title,
  desc,
  desc2,
  onPress,
  end = false,
  isUser = false,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.profile__option, end && styles.profile__option__end, isUser && styles.profile__option__user,]}
    >
      <View style={styles.option__icon}>
        <Image source={icon} style={styles.option__image} />
        <View style={styles.option__info}>
          <Text style={styles.info__title}>{title}</Text>
          <View style={styles.info__text}>
            <Text style={styles.info__desc}>{desc}</Text>
            <Text style={styles.info__desc}>{desc2}</Text>
          </View>
        </View>
      </View>

      <View style={styles.option__nav}>
        <Image
          source={require("../../assets/profile_arrow-right-icon.png")}
          style={styles.nav__arrow}
        />
      </View>
    </TouchableOpacity>
  );
});

export default ProfileOption;
