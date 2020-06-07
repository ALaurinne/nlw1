import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SvgUri } from 'react-native-svg'
import Constants from 'expo-constants'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'

import api from '../../services/api'

interface Item{
  id:number;
  name:string;
  image:string;
}

interface Point{
  id: number;
  image: string;
  image_url: string;
  name: string;
  lagitude:number;
  longitude:number;
}

interface Params{
  uf: string;
  city: string;
}

const Points = () =>{
  const [items, setItems] = useState<Item[]>([])
  const [points, setPoints] = useState<Point[]>([])
  const navigation = useNavigation();
  const [initialPosition,setInitialPosition] = useState<[number,number]>([0,0])
  
  const [selectedItems,setSelectedItems] = useState<number[]>([])

  const route = useRoute()
  const routeParams = route.params as Params;


  // Items
  useEffect(()=>{
    api.get('items').then(response => {
        setItems(response.data) 
    })
  })

  // Points
  useEffect(()=>{
    api.get('points',{
      params:{
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItems,
      }
    }).then(response => {
      setPoints(response.data)
    })
  },[selectedItems])

  // Localização inicial
  useEffect(() =>{

    async function loadPosition(){
    
      // Solicita permissao para usar geolocalizacao
      const { status } = await Location.requestPermissionsAsync()

      // Verifica se permitiu
      if(status !== 'granted'){
        // Alerta caso negado
        Alert.alert('Ooops..','ONDE CÊ TÁ?')
        return
      }

      // Pega a localizacao
      const location = await Location.getCurrentPositionAsync()

      // Pega coordenadas
      const {latitude, longitude} =  location.coords
      
      // Seta posicao inicial
      setInitialPosition([
        latitude,
        longitude
      ])      
    }

    loadPosition();

  },[])

  // Volta para a home
  const handleNavigationBack = () =>{
    navigation.goBack();
  }

  // Acessa a pagina de Detail
  const handleNavigationToDetail = (id: number) =>{
    navigation.navigate('Detail',{point_id: id})
  }

  // Seleciona itens
  const handleSelectItem = (id: number) =>{
    const alreadySelected = selectedItems.findIndex(item => item == id)

    if(alreadySelected >= 0){
      const filteredItems = selectedItems.filter(item => item !== id)
      setSelectedItems(filteredItems)
    }else{
      setSelectedItems([...selectedItems, id])
    }
  }

  

  return (
    <>
    {/* Mapa */}
      <View style={styles.container}>
        {/* Botão voltar */}
        <TouchableOpacity onPress={handleNavigationBack}>
            <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem Vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de colega.</Text>

        {/* Mapa */}
        <View style={styles.mapContainer}>
          {/* Exibir o mapa */}
          
          { initialPosition[0] !== 0 && (
            <MapView 
            style={styles.map}
            initialRegion={{
              latitude:initialPosition[0],
              longitude:initialPosition[1],
              latitudeDelta:0.014,
              longitudeDelta:0.014,
            }}
          >
            {/* Marcação no mapa */}
            {points.map(point => (
              <Marker 
                key={String(point.id)} 
                style={styles.mapMarker} 
                onPress={() => handleNavigationToDetail(point.id)} 
                coordinate={{
                  latitude: point.lagitude,
                  longitude: point.longitude
                }}
              >
                {/*  */}
                <View style={styles.mapMarkerContainer}>
                  <Image style={styles.mapMarkerImage}
                    source={{uri:point.image_url}}
                  />
                  <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
          )}
        </View>
      </View>

      {/* Itens */}
      <View style={styles.container}>
        <ScrollView horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal:0}}  
        >
          {items.map(item => (

            <TouchableOpacity 
              key={String(item.id)} 
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem:{}
              ]} 
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.image}/>
              <Text style={styles.itemTitle}>{item.name}</Text>
            </TouchableOpacity> 
              
          ))}

          
        </ScrollView>
      </View>
    </>
  )
}

export default Points


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});