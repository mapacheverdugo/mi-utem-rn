import React, { Component } from 'react';
import { Platform, Text, View, TextInput, StyleSheet } from 'react-native';

const ES_IOS = Platform.OS === 'ios';

export default class PerfilCampo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.textoEtiqueta}>{this.props.etiqueta}</Text>
                <TextInput value={this.props.valor} disabled="disabled"></TextInput>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: ES_IOS ? 10 : 5
    },
    textoEtiqueta: {
        fontWeight: 'bold'
    }
});