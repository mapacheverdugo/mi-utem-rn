import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, FlatList, AsyncStorage } from 'react-native';
import { Cache } from "react-native-cache";

import PerfilCampo from '../components/PerfilCampo';

import ApiUtem from '../ApiUtem';

import colors from '../colors';

var cache = new Cache({
    namespace: "estudiantes",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});
var apiUtem = new ApiUtem();

export default class PerfilScreen extends Component {
    constructor(props) {
        super(props);
        this._getPerfil = this._getPerfil.bind(this);
        this.state = {
            campos: [],
            perfil: null
        }
    }

    _getPerfil = async () => {
        const rut = await AsyncStorage.getItem('rut');
        const token = await AsyncStorage.getItem('userToken');
        cache.getItem(rut, async (err, cache) => {
            if (err) {
                const perfil = await apiUtem.getPerfil(token, rut);
                console.log(perfil)
                this._renderPerfil(perfil);
            } else {
                console.log(cache)
                this._renderPerfil(cache)
            }

        });

        
    }

    _renderPerfil = (estudiante) => {
        var campos = []

        /*
        if (estudiante.nombre != null)
            campos.push({
                etiqueta: "Nombre Completo",
                valor: estudiante.nombre.nombres +" "+ estudiante.nombre.apellidos
            })
        else
            campos.push({
                etiqueta: "Nombre",
                valor:"Nombre no asignado"
            })
        */

        if (estudiante.rut != null)
            campos.push({
                etiqueta: "RUT",
                valor:estudiante.rut.toString()
            })
        else
            campos.push({
                etiqueta: "RUT",
                valor: "No tiene Rut asignado"
            })

        if (estudiante.correoPersonal != null)
            campos.push({
                etiqueta:"Correo personal",
                valor:estudiante.correoPersonal
            })
        else
            campos.push({
                etiqueta:"Correo personal",
                valor:"No hay registro de correo personal"
            })

        if (estudiante.nacimiento != null) {
            var s=estudiante.nacimiento
            var d=new Date();
            d.setFullYear(s.substr(6,4),s.substr(3,2)-1,s.substr(0,2));
            var hoy= new Date();
            var Edad = new Date(hoy-d)

            campos.push({
                etiqueta: "Fecha de nacimiento",
                valor: Edad.getFullYear().toString()
            })
        } else
            campos.push({
                etiqueta: "Fecha de nacimiento",
                valor: "No tiene nacimiento asignado"
            })

        if (estudiante.sexo.sexo != null)
            campos.push({
               etiqueta:"Sexo",
               valor:estudiante.sexo.sexo
            })
        else
            campos.push({
                etiqueta:"Sexo",
                valor:"No hay registro de su sexo"
            })

        if (estudiante.telefonoMovil != null)
            campos.push({
                etiqueta: "Telefono móvil",
                valor:estudiante.telefonoMovil.toString()
            })
        
        else
            campos.push({
                etiqueta:"Telefono móvil",
                valor:"No hay telefono asignado"
            })
        
        if (estudiante.telefonoFijo)
            campos.push({
                etiqueta: "Telefono fijo",
                valor:estudiante.telefonoFijo.toString()
            })
        else
            campos.push({
                etiqueta:"Telefono fijo",
                valor: "No hay telefono asignado"
            })
        /*
        if (estudiante.correoUtem != null)
            campos.push({
                etiqueta:"Correo institucional",
                valor:estudiante.correoUtem
            })
        else
            campos.push({
                etiqueta:"Correo institucional",
                valor:"No hay registro de un correo institucional"
            })
        */
        
        if (estudiante.nacionalidad.nacionalidad != null)
            campos.push({
                etiqueta:"Nacionalidad",
                valor:estudiante.nacionalidad.nacionalidad
            })
        else
            campos.push({
                etiqueta:"Nacionalidad",
                valor:"No hay registro de nacionalidad"
            })
        
        if (estudiante.direccion.comuna.comuna != null)
            campos.push({
                etiqueta:"Comuna",
                valor:estudiante.direccion.comuna.comuna
            })
        else
            campos.push({
                etiqueta:"Comuna",
                valor:"No hay comuna registrada"
            })
        
        if (estudiante.direccion.direccion)
            campos.push({
                etiqueta:"Dirección",
                valor:estudiante.direccion.direccion
            })
        else
            campos.push({
                etiqueta:"Dirección",
                valor:"No hay dirección registrada"
            })
        
        this.setState({
            campos: campos,
            perfil: estudiante
        })
    }

    componentWillMount() {
        this._getPerfil();
    }

    render() {
        const nombre = this.state.perfil ? this.state.perfil.nombre : null;
        return (
            <ScrollView>
                <View style={styles.headerContainer}>
                    <View style={styles.fotoContainer}>
                        <Image source={{uri: this.state.perfil ? this.state.perfil.fotoUrl : ""}} style={styles.foto} />
                    </View>
                    <Text style={styles.textoNombre}>{nombre != null ? (nombre.completo ? nombre.completo : (nombre.apellidos ? nombre.nombres + " " + nombre.apellidos : nombre)) : ""}</Text>
                    <Text style={styles.textoCorreo}>{this.state.perfil ? this.state.perfil.correoUtem : ""}</Text>
                </View>
                
                <FlatList
                    data={this.state.campos}
                    style={styles.lista}
                    renderItem={({item}) => 
                        <PerfilCampo etiqueta={item.etiqueta} valor={item.valor}/>
                    }/>
            </ScrollView>
        );

    }
}

const styles = StyleSheet.create({
    headerContainer: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    }, 
    fotoContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    foto: {
        height: 104,
        width: 104,
        borderRadius: 52,
        
    },
    textoNombre: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10
    },
    textoCorreo: {
        color: colors.material.grey['600']
    }
});