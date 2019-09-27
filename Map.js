import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class Map extends Component {
  state = {
    location: this.props.location,
    lat: null,
    lon: null
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  render () {

    if (this.state.location) {
      console.log("==> from inside Map, lat:", this.state.location.coords.latitude)
    }

    marker = () => {
      if (this.state.location) {
        latlng = {
          latitude: this.state.location.coords.latitude,
          longitude: this.state.location.coords.longitude,
        }
        return <Marker draggable
            coordinate={latlng}
            onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
          />
      }
    }

    return (
      <MapView
        style={{ backgroundColor: "blue", flex: 3 }}
        initialRegion={{
          latitude: 43.644913,
          longitude: -79.402520,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {marker()}
      </MapView>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
