import React, { useEffect, useState, ReactElement, useRef } from 'react';
import axios from 'axios';
import {AppBar, Box, TextField, Grid, Button, Typography, Avatar, Tooltip, FormControl,InputLabel, Select, MenuItem, SelectChangeEvent , CssBaseline, IconButton, colors} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  AccountBalance as BankIcon,       
  Home as HomeIcon,                 
  Agriculture as WheatIcon,         
  Business as BuildingIcon,         
  CreditCard as CreditCardIcon,     
  Work as BriefcaseIcon,            
  Security as ShieldCheckIcon,      
  Factory as FactoryIcon,  
  Grass as GrassIcon,
  Flag as FlagIcon, 
  FilterAltRounded,                 
} from "@mui/icons-material";

export default function Investimentos(){
    const [showFilters, setShowFilters] = useState(false)

    const valorMinimoRef = useRef<HTMLInputElement>(null);
    const tituloRef = useRef<HTMLInputElement>(null);
    const vencimentoRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        rentabilidade: '',
        tipo: '',
        liquidez_diaria: ''
    });
    const [resposta, setResposta] = useState<Rendas[]>([]);
    const [allInvestments, setAllInvestments] = useState<Rendas[]>([]);

    interface Rendas {
        'id': string,
        'titulo': string,
        'vencimento': string,
        'valor mínimo': string,
        'taxa': string,
        'liquidez': string,
        'tipo': string
    }

    const theme = createTheme({
        palette:{
            background:{
                default: 'black'
            }
        }
    })

    const textFieldstyle = {
        '& label': {color: 'white'},
        '& label.Mui-focused': {color: 'white'}, 
        '& .MuiOutlinedInput-root': {
            '& fieldset': {borderColor: 'white'},
            '&:hover fieldset': {borderColor: 'white'},
            '&.Mui-focused fieldset': {borderColor: 'white'}, 
            backgroundColor: 'transparent', 
        },
        '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px transparent inset', 
            WebkitTextFillColor: 'white', 
            transition: 'background-color 5000s ease-in-out 0s',
        },
    };

    const textFieldSlotProps = {input:{sx: { height: 40, marginTop: '5px', color: 'white'}}};

    const selectStyle = {
        width: '195px', 
        height: 40,
        color: 'white',
        '& .MuiSelect-icon': {color: 'white'},
        '& fieldset': {borderColor: 'white'},
        '&:hover fieldset': {borderColor: 'white'},
        '&.Mui-focused fieldset': {borderColor: 'white'}
    }

    const buttonStyle = {color: 'rgba(27, 33, 44, 1)', padding: '0 20px', background: 'white', fontSize: 'bold',
        '&:hover': {
            backgroundColor: 'rgba(27, 33, 44, 1)',
            color: 'white',
            border: '1px solid white',
            transform: 'translateY(-4px)', 
        }}

    const selectLabelStyle = {fontSize: '15px', fontWeight: 'bold'}

    type TipoInvestimento =| "CDB" | "LCI" | "LCA" | "CRA"| "CRI"| "RDB"| "LF"| "LIG"| "Debênture"| "Tesouro Direto";
    
    const tiposInvestimentos: TipoInvestimento[] = ["CDB", "LCI", "CRA", "CRI", "RDB", "LF", "LIG", "Debênture", "Tesouro Direto"];

    const icons: Record<TipoInvestimento, ReactElement> = {
        CDB: <BankIcon sx={{ color: "#007BFF", fontSize: 18, marginTop: '3px'}} />,
        LCI: <HomeIcon sx={{ color: "#4CAF50", fontSize: 18, marginTop: '3px'}} />,
        LCA: <GrassIcon sx={{ color: "#b3d36eff", fontSize: 18, marginTop: '3px'}}/>,
        CRA: <WheatIcon sx={{ color: "#9C27B0", fontSize: 18, marginTop: '3px'}} />,
        CRI: <BuildingIcon sx={{ color: "#FF9800", fontSize: 18, marginTop: '3px'}} />,
        RDB: <CreditCardIcon sx={{ color: "#03A9F4", fontSize: 18, marginTop: '3px'}} />,
        LF: <BriefcaseIcon sx={{ color: "#673AB7", fontSize: 18, marginTop: '3px'}} />,
        LIG: <ShieldCheckIcon sx={{ color: "#00BCD4", fontSize: 18, marginTop: '3px'}} />,
        Debênture: <FactoryIcon sx={{ color: "#E91E63", fontSize: 18, marginTop: '3px'}} />,
        "Tesouro Direto": <FlagIcon sx={{ color: "#4CAF50", fontSize: 18, marginTop: '3px'}} />,
    };

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://investfix-backend-dsy7.onrender.com/investments')
            .then(response => {setResposta(response.data); setAllInvestments(response.data)})
    }, [])
    
    const handleSubmit = () => {
        const dados = {
        ...formData,
        titulo: tituloRef.current?.value || '',
        valor_minimo: valorMinimoRef.current?.value || '',
        vencimento: vencimentoRef.current?.value || '',
    }
        axios.post('https://investfix-backend-dsy7.onrender.com/investments', {body: dados})
            .then(response => {setResposta(response.data); console.log(resposta)})
        console.log(dados)
    };
    
    const handleClean = () => {
        setFormData({rentabilidade: '', tipo: '',liquidez_diaria: ''});
        if (tituloRef.current) tituloRef.current.value = "";
        if (vencimentoRef.current) vencimentoRef.current.value = "";
        if (valorMinimoRef.current) valorMinimoRef.current.value = "";

        setResposta(allInvestments)
    };

    const grupos = [];

    for (let i = 0; i < resposta.length; i +=4) {
        grupos.push(resposta.slice(i, i + 4));
    }

    const toggle = () => {
        setShowFilters((prev) => !prev)
    }

    const handleChange = (field: keyof typeof formData) => (event: SelectChangeEvent) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };
    
    const palavras = ['CEEE-G', 'VIARONDON C', 'VAMOS L', 'GOIAS', 'DIREITOS'];     
    const filterTip = showFilters ? 'Desativar filtros' : 'Ativar Filtros';

    console.log({tiposInvestimentos})
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar sx={{backgroundColor: 'rgba(27, 33, 44, 1)', height: '90px', display: 'flex'}}>
            <Grid container gap={1} sx={{marginLeft: '40px', marginTop: '30px',}}>
                <Box component="img" src={process.env.PUBLIC_URL + "/static/investfix-logo.png"} alt="Logo Investfix" sx={{width: '40px', height: '32px',}}/>
                <Typography variant="body1" style={{ fontWeight: 'bold', fontSize: '23px', color: 'gold'}}> INVESTFIX</Typography>
            </Grid>            
            <Grid container sx={{marginRight:'40px', marginTop: '-35px', }} justifyContent="flex-end" >
                <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => navigate('/')}>Home</Button>
                <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => navigate('/calculator')}>Calculadora</Button>  
                <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => navigate('/simulator')}>Simulador</Button>       
                <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => navigate('/investimentos')}>Investimentos</Button>
                <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => {localStorage.setItem('scrollToSection', 'quem-somos');
                     window.location.href = '/Investfix'}}>Quem Somos</Button>
                <Avatar alt="Nome do Usuário" src={process.env.PUBLIC_URL + "/static/perfil-porquinho.png"} sx={{ marginLeft: '30px'}}/>
            </Grid>
            </AppBar>

            <Typography sx={{marginTop: '120px', color: 'gold', textAlign: 'center', fontFamily: 'Roboto', fontSize: '25px'}}>INVESTFIX</Typography>
                <Tooltip title={filterTip} placement="right" sx={{fontSize: '20px'}} slotProps={{
                        tooltip: {
                        sx: {
                            fontSize: '1rem', 
                            backgroundColor: '#333',
                            padding: '6px 12px',
                            borderRadius: '20px'
                        },
                        },
                    }}>
                    <IconButton onClick={toggle}>
                    <FilterAltRounded sx={{ color: 'white', fontSize: 45, marginTop: '50px', marginLeft:'75rem'}}/>
                    </IconButton>
                </Tooltip>
                {(showFilters) && (
                        <Grid sx={{margin: '20px',width: '700px', height: '250px', textAlign: 'center', justifySelf: 'center', background: 'rgba(27, 33, 44, 1)', borderRadius: '9px', justifyItems: 'center', border: '1px solid grey'}}>
                            <Typography sx={{color: 'white', paddingTop: '20px', fontFamily: 'Roboto', fontWeight: 'bold', fontSize: '20px'}}>Filtros</Typography>
                            <Grid container gap={3} sx= {{marginTop: '20px'}}>
                                <TextField name='titulo' label="Título"  variant="outlined" onKeyDown={(e) => {if(e.key === 'Enter') handleSubmit()}} inputRef={tituloRef} slotProps={textFieldSlotProps} sx={textFieldstyle}/>
                                <TextField name='vencimento' type="number" label="Vencimento (meses)" variant="outlined" onKeyDown={(e) => {if(e.key === 'Enter') handleSubmit()}} inputRef={vencimentoRef} slotProps={textFieldSlotProps} sx={textFieldstyle}/>
                                <TextField name='valor minimo' type="number" label="Valor mínimo" variant="outlined" onKeyDown={(e) => {if(e.key === 'Enter') handleSubmit()}} inputRef={valorMinimoRef} slotProps={textFieldSlotProps} sx={textFieldstyle}/>
                            </Grid>

                            <Grid container gap={3} sx= {{marginTop: '20px'}}>
                                <Box sx={{color: 'white'}}>
                                    <FormControl fullWidth sx={{color: 'white'}}>
                                        <InputLabel id="demo-simple-select-label" sx={{marginTop:'-5px', color: 'white'}} >Rentabilidade</InputLabel>
                                        <Select value={formData.rentabilidade} label="Rentabilidade" slotProps={{input:{sx: {textAlign: 'left'}}}} onChange={handleChange('rentabilidade')} sx={selectStyle}>
                                            <MenuItem value={'Pré-Fixado'}>Pré-Fixado</MenuItem>
                                            <MenuItem value={'Pós-Fixado'}>Pós-Fixado</MenuItem>
                                            <MenuItem value={'IPCA'}>IPCA</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box >
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label" sx={{marginTop:'-5px', color: 'white'}}>Tipo</InputLabel>
                                        <Select value={formData.tipo} label="Tipo" onChange={handleChange('tipo')} slotProps={{input:{sx: {textAlign: 'left'}}}} sx={selectStyle}>
                                            {
                                                tiposInvestimentos.map((tipo, index) => <MenuItem value={tipo} key={index}>{tipo}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box >
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label" sx={{marginTop: '-5px', color: 'white'}}>Liquidez Diária</InputLabel>
                                        <Select value={formData.liquidez_diaria} label="Liquidez Diária" onChange={handleChange('liquidez_diaria')} slotProps={{input:{sx: {textAlign: 'left'}}}} sx={selectStyle}>
                                            <MenuItem value={'sim'} sx={{justifyContent: 'left'}}>Sim</MenuItem>
                                            <MenuItem value={'não'}>Não</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid container gap={1.9} sx={{marginTop: '30px' }}>
                                <Button onClick={handleClean} sx={buttonStyle}>Limpar</Button>
                                <Button onClick={handleSubmit} sx={buttonStyle}>Filtrar</Button>
                            </Grid>
                         
                        </Grid>                
                )}
            
            <Grid sx={{marginTop: '-20px', display: 'flex', flexDirection: 'column', gap: '20px', padding: '40px 30px', justifySelf: 'center', borderRadius: '20px', marginBottom: '40px'}}>
                {
                    grupos.map((grupo, linhaIndex) => (
                        <Grid container key={linhaIndex} gap={4} sx={{marginLeft: 'auto', marginRight: 'auto',}}>
                        {
                            grupo.map((item, index) => (                                
                                <Grid key={index} sx={{width: '15rem', height: '250px', border: '0.5px solid #8f8e8eff', display: 'flex', background: 'rgba(31, 32, 33, 1)',
                                flexDirection: 'column', gap: '10px', padding: '10px', color: 'white', borderRadius: '10px', textAlign: 'center', }}>
                                    <Grid container gap={0.5} sx={{ justifyContent:'center'}}>
                                        <Typography>{item.tipo}</Typography>    
                                        {icons[item.tipo as TipoInvestimento]}
                                    </Grid>
                                    <Typography sx={{fontSize: palavras.some(palavra => item.titulo.includes(palavra)) ? '14px' : '16px'}}>{item.titulo}</Typography>
                                    <Box sx={{border: '0.5px solid #8f8e8eff', width: '13rem', height: '1px'}}></Box>
                                        <Grid container gap={2} sx={{color: '#dddadaff', marginLeft: '10px'}}>
                                            <Typography>Rentabilidade</Typography>
                                            <Typography>Vencimento</Typography>
                                        </Grid>
                                        <Grid container gap={2} sx={{color: 'white', marginLeft: '10px'}}>
                                            <Typography sx={{...selectLabelStyle, marginRight: item.taxa.includes('CDI') ? '20px' : /^\d+,\d{2}%$/.test(item.taxa) ? '45px': 0}}>{item.taxa}</Typography>
                                            <Typography sx={{marginLeft: '11px', fontSize: '15px', fontWeight: 'bold'}}>{item.vencimento}</Typography>

                                        </Grid>
                                        <Grid container gap={2} sx={{color: 'white', marginLeft: '10px'}}>
                                            <Typography>Valor mínimo</Typography>
                                            <Typography>Liquidez</Typography>
                                        </Grid>
                                        <Grid container gap={2} sx={{color: 'white',marginLeft: '10px'}}>
                                            <Typography sx={{fontSize: '15px', fontWeight: 'bold'}}>{item['valor mínimo']}</Typography>
                                            <Typography sx={{ fontSize: '15px', fontWeight: 'bold', marginLeft: item.liquidez === 'Diária' ? '23px' : item.liquidez.includes('D+90') ? '20px' : '1px'}}>{item.liquidez}</Typography>   
                                        </Grid>
                                </Grid>
                            ))
                        }
                        </Grid>
                    ))
                }
            </Grid>
            <Grid sx={{backgroundColor: 'rgba(27, 33, 44, 1)', position: 'fixed', bottom: 0, textAlign: 'center', height: '50px', alignContent: 'center', width: '100%'}}>
                    <Typography sx={{color: 'white', fontWeight: 'bold'}}>&copy; 2025 Malu Chen da Fonseca. Todos os direitos reservados</Typography>
            </Grid>
        </ThemeProvider>
        
    )
}