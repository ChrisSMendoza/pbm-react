import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'

class RecentMachines extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            machines: this.props.machines.machines
        }
    }

    render(){
        return(
            <View>
                <Text>MACHINES</Text>
                {this.state.machines.map(machine => <Text key={machine.id}>{machine.name}</Text>)}
            </View>)
    }
}

RecentMachines.propTypes = {
    machines: PropTypes.object,
}

const mapStateToProps = ({ machines }) => ({ machines })
export default connect(mapStateToProps)(RecentMachines)
