import React, { Component } from 'react';
import { Text, View, FlatList, SafeAreaView, Image,Platform,StatusBar,StyleSheet} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize'

import * as Font from "expo-font"
import AppLoading from "expo-app-loading"

import StoryCard from "./StoryCard"

import firebase from "firebase"

let stories = require('./temp.json')

let customFonts = {
    'Bubblegum-sans':require('../assets/fonts/BubblegumSans-Regular.ttf')
}

export default class Feed extends Component {

    keyExtractor = (item, index) => index.toString();

    renderItem=({item:story})=>{
        return <StoryCard story={story} navigation={this.props.navigation}/>
    }

    constructor(){
        super()
        this.state={
            fontsLoaded:false,
            light_theme:true
        }
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
      }
    
      componentDidMount() {
        this._loadFontsAsync();
        this.fetchUser()
      }
    
      fetchUser = () => {
        let theme;
        firebase
          .database()
          .ref("/users/" + firebase.auth().currentUser.uid)
          .on("value", snapshot => {
            theme = snapshot.val().current_theme;
            this.setState({ light_theme: theme === "light" });
          });
      };
    
    render(){
        if (!this.state.fontsLoaded) {
            return <AppLoading />;
        } else {
        return(
            <View style={this.state.light_theme?styles.containerLight:styles.container}>
            <SafeAreaView style={styles.droidSafeArea}/>
            <View style={styles.appTitle}>
              <View style={styles.appIcon}>
                <Image source={require('../assets/logo.png')}  style={styles.appIcon}></Image>
              </View>
              <View style={styles.appTitleTextContainer}>
                 <Text style={this.state.light_theme?styles.appTitleTextLight:styles.appTitleText}>StoryTellingApp</Text>
              </View>
            </View>
            <View style={styles.cardContainer}>
                <FlatList
                 keyExtractor={this.keyExtractor}
                 data={stories}
                 renderItem={this.renderItem}
                />
            </View>
          </View>
        )
        }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  containerLight: {
    flex: 1,
    backgroundColor: "white"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  cardContainer: {
    flex: 0.85
  }
});

