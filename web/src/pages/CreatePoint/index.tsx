import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import check from '../../assets/check-circle.svg';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';
import { LeafletMouseEvent } from 'leaflet';
import path from 'path';
// Aproveitar elementos semanticos do HTML

const CreatePoint = () => {

    // Item 
    interface Item {
        id: number;
        title: string;
        image_url: string;
    }

    interface IBGEUFResponse {
        sigla: string;
    }

    interface IBGECityResponse {
        nome: string;
    }

    // sempre que cria um estado para um array ou objeto, precisa-se informar manualmente o tipo da variavel 
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [selectedUF, setSelectedUf] = useState('0');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const history = useHistory();
    const [open, setOpen] = useState(false);
    

    //Executa a função sempre que variavel muda, em vazio, executa apenas uma vez, quando o componente aparecer em tela
    useEffect(() => {
        api.get('items').then(response =>{
            setItems(response.data);
        });
    }, []);

    // Municipios 
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response =>{
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        });
    }, []);

    // Carregar as cidades sempre que a UF mudar
    useEffect(() => {
        if(selectedUF === '0'){
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
        .then(response =>{
            const cityNames = response.data.map(city => city.nome);
            setCities(cityNames);
        });
    }, [selectedUF]);

    // Pegar a posição atual do usuário
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position =>{
            const { latitude, longitude } = position.coords;

            setInitialPosition([latitude, longitude]);
        })
        
    }, []);


    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUf(uf);
    };

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city);
    };

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    };

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        setFormData({...formData, [name]: value});
    };

    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);
        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        
        const { name, email, whatsapp } = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [lagitude, longitude] = selectedPosition;
        const items = selectedItems;
        const data = {
            name,
            email,
            whatsapp,
            lagitude,
            longitude,
            city,
            uf,
            items,
        }

        // criando no banco de dados
        await api.post('points', data);

        // alertando que foi criado 
        // alert('Ponto de coleta criado!');
       
    }

    function handleOpen() {
        setOpen(true);

        setTimeout(() => {
            //retornando para tela inicial
            history.push('/');
        }, 2000)
        
    }

    return (
        <>
        {open === true ? 
            <div id="modal">
                <div className="content">
                    <FiCheckCircle color="#34CB79" size={50} className="svg"/>
                    <h1>Cadastro Concluido!</h1>
               </div>
            </div>
        : false}
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do<br />ponto de coleta</h1>
                
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                            placeholder="Nome do ponto de coleta"
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                                placeholder="Email"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                                placeholder="+XX XX XXXXX-XXXX"
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map
                    center= {initialPosition}
                    zoom={15} 
                    onClick={handleMapClick}>
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position = {selectedPosition}/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                             <select 
                                name="uf"
                                id="uf" 
                                value={selectedUF} 
                                onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                    ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li
                            key={item.id}
                            onClick={() => handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                            <img src={item.image_url} alt={item.title}/>
                            <span>{item.title}</span>
                            </li>
                            )
                        )}
                        
                    </ul>
                </fieldset>

                <button onClick={handleOpen} type="submit">Cadastrar ponto de coleta</button>

            </form>

            
        </div>
        </>
    );
};

export default CreatePoint;