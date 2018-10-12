import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatList, Text, View, StyleSheet } from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { LocationCard } from '../components'
import { getDistance } from '../utils/utilityFunctions'

export class LocationList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            buttonIndex: 0,
            locations: this.props.locations.mapLocations,
        }
    }

  static navigationOptions = ({ navigation }) => {
      return {
          headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title="Map" />,
          title: 'LocationList',
      }
  };
  
  updateIndex = (buttonIndex) => {
      this.setState({ buttonIndex })
      switch(buttonIndex) {
      case 0:
          return this.setState({
              locations: this.state.locations.sort((a, b) => getDistance(this.props.user.lat, this.props.user.lon, a.lat, a.lon) - getDistance(this.props.user.lat, this.props.user.lon, b.lat, b.lon))
          })
      case 1:
          return this.setState({
              locations: this.state.locations.sort((a, b) => {
                  const locA = a.name.toUpperCase()  
                  const locB = b.name.toUpperCase()
                  return locA < locB ? -1 : locA === locB ? 0 : 1
              })
          })
      case 2:
          return this.setState({
              locations: this.state.locations.sort((a, b) => a.updatedAt > b.updatedAt)
          })
      }
  }

  render() {
      return (
          <View style={{ flex: 1 }}>
              <Text style={s.sort}>SORT BY:</Text>
              <ButtonGroup
                  onPress={this.updateIndex}
                  selectedIndex={this.state.buttonIndex}
                  buttons={['Distance', 'Alphabetically', 'Last Updated']}
                  containerStyle={{ height: 30 }}
                  selectedButtonStyle={s.buttonStyle}
                  selectedTextStyle={s.textStyle}
              />
              <View style={{ flex: 1, position: 'absolute', left: 0, top: 65, bottom: 0, right: 0 }}>
                  <FlatList
                      data={this.state.locations}
                      extraData={this.state}
                      renderItem={({ item }) =>
                          <LocationCard
                              name={item.name}
                              distance={getDistance(this.props.user.lat, this.props.user.lon, item.lat, item.lon)}
                              street={item.street}
                              state={item.state}
                              zip={item.zip}
                              machines={item.machine_names} 
                              type={item.location_type_id ? this.props.locations.locationTypes.find(location => location.id === item.location_type_id).name : ""}
                              navigation={this.props.navigation}
                              id={item.id}/>
                      }
                      keyExtractor={(item, index) => `list-item-${index}`}
                  />
              </View>
          </View>
      )
  }
}

const s = StyleSheet.create({
    sort: {
        textAlign: 'center',
        marginTop: 5,
    },
    buttonStyle: {
      backgroundColor: '#D3ECFF',
    },
    textStyle: {
        color: '#000000',
        fontWeight: 'bold',
    },
})

LocationList.propTypes = {
    locations: PropTypes.object, 
    user: PropTypes.object, 
    navigation: PropTypes.object,
}

const mapStateToProps = ({ locations, user }) => ({ locations, user })
export default connect(mapStateToProps)(LocationList)
