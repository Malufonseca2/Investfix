import { useEffect, useState} from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {AppBar, Box, Button, Typography, Avatar, FormControlLabel, Radio, RadioGroup, CssBaseline, CircularProgress} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import '@fontsource/roboto/300.css'

export default function Calculator(){
    type Investimento = {
        id: number;
        liquidez: string;
        taxa: string;
        tipo: string;
        titulo: string;
        'valor mínimo': string;
        vencimento: string;
        total_investido: number;
        imposto_pago: number;
        lucro_bruto: number;
        lucro_liquido: number;
        valor_final_bruto: number;
        valor_final_liquido: number; 
    };

    const navigate = useNavigate();
    const [resposta, setResposta] = useState<Investimento | undefined>()
    const [displayResponse, setDisplayResponse] = useState(false)
    const [incompleto, setIncompleto] = useState<string[]>([])
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        valor_inicial: '',
        valor_mensal: '',
        prazo: '',
        liquidez_diaria: false,
        objetivo: ''
    });
    const theme = createTheme({
        palette:{
            background:{
                default: 'black'
            }
        }
    })

    const textFieldStyle = (field: string) => ({
        width: '200px',
        input: { color: 'white'},
        label: { color: incompleto.includes(field) ? 'red' : 'white' }, 
        '& .MuiOutlinedInput-root': {
            '& fieldset': {borderColor: incompleto.includes(field) ? 'red' : 'white'},
            '&:hover fieldset': {borderColor: incompleto.includes(field) ? 'red' : 'white'},
            '&.Mui-focused fieldset': {borderColor: 'white'},
        },
    })

    type InvestmentInfo = {
        text: string;
        cdbs?: string[];
        };

    function textInvestment(type: string): InvestmentInfo {
        switch (type) {
            case 'CDB':
            return {
                        text: `É um investimento oferecido por bancos.
                        Você “empresta” seu dinheiro ao banco por um tempo, e ele te devolve com juros.
                        💰 É seguro (garantido pelo FGC até R$ 250 mil) e ideal pra quem quer rendimento maior que a poupança.
                        Existem três tipos:`,
                        cdbs: [
                            'CDB pós-fixado: rende um percentual do CDI (ex: 110% do CDI).',
                            'CDB prefixado: tem uma taxa fixa (ex: 12% ao ano).',
                            'CDB IPCA+: rende o IPCA (inflação) + uma taxa fixa.'
                        ]
                    };
            case 'LCI':
                return {
                    text: `Você empresta dinheiro ao setor imobiliário (financiamento de imóveis).
                        O banco usa o dinheiro para financiar construtoras ou compradores e te devolve com juros.
                        💡 Isenta de Imposto de Renda para pessoa física e também garantida pelo FGC. Boa pra quem quer segurança e rendimento líquido maior.`
                };
            case 'CRA':
                return {
                    text: `Você “empresta” dinheiro para empresas do agronegócio.
                        Elas usam o capital pra financiar sua produção e te pagam com juros.
                        📈 Tem rendimento alto, mas sem garantia do FGC. É mais indicado pra quem aceita um pouco mais de risco.`
                };
            case 'CRI':
                return {
                    text: `Funciona como o CRA, mas voltado ao setor imobiliário.
                        Você financia empreendimentos ou financiamentos de imóveis.
                        📈 Pode render bem, mas não tem FGC — o risco é do tomador do crédito.`
                };
            case 'RDB':
                return {
                    text: `Parecido com o CDB, mas normalmente emitido por fintechs ou cooperativas.
                        O dinheiro fica aplicado por um tempo e você recebe juros no resgate.
                        💰 Também tem garantia do FGC, e é bom pra quem quer segurança e rendimento previsível.`
                };
            case 'LF':
                return {
                    text: `É um título emitido por bancos grandes para captar valores maiores.
                        Geralmente exige investimento mínimo alto e prazo mais longo, mas oferece rendimentos maiores.
                        ⚠️ Não tem liquidez diária — o dinheiro fica preso até o vencimento.`
                    };
            case 'LIG':
                return {
                    text: `Parecida com a LCI, mas com uma camada extra de segurança:
                        O investidor tem duas garantias — a do emissor e a da carteira de créditos imobiliários.
                        💡 Boa opção pra quem quer segurança e retorno de médio a longo prazo.`
                    };
            case 'Debênture':
                return {
                    text: `É um empréstimo direto para empresas (não bancos).
                        Você recebe juros em troca, geralmente com rentabilidade superior à renda fixa tradicional.
                        ⚠️ Não tem FGC, então tem risco maior, mas pode render bem mais.
                        Algumas (as “incentivadas”) não pagam imposto de renda.`
                };
            case 'Tesouro Direto':
                return {
                    text: `Você empresta dinheiro para o Governo Federal.
                        É um dos investimentos mais seguros do país, com diferentes tipos de rendimento (fixo, atrelado à inflação ou à taxa Selic).
                        💰 Ideal pra quem quer segurança e simplicidade.`
                };
            default:
                return {
                    text: 'Tipo de investimento não reconhecido.'
                };
            }
    }
    
    let incomplete: string[] = [];
    useEffect(() => {
        if (resposta !== undefined) {
            setLoading(false)
        } else {
            setLoading(true)
        }
    }, [resposta]);
    function submit() {
        Object.entries(formData).forEach(([key, value]) => { (value === '') && (incomplete.push(key))})
        setIncompleto(incomplete);
        if (incomplete.length !== 0){
            return
        }
         
        const body = { ...formData }; 
        axios.post('https://investfix-backend-dsy7.onrender.com/calculate', {
            body
        })
        .then(response => {setResposta(response.data); console.log(response.data, typeof response.data)})
        .catch((error) => {
        console.error('Erro ao enviar requisição:', error);
        })
        .finally(() => {
        console.log('Requisição finalizada');
        });
        setDisplayResponse(true)
    }
  
    function limparForm(){
        setFormData({valor_inicial: '',
        valor_mensal: '',
        prazo: '',
        liquidez_diaria: false,
        objetivo: ''})
    }

    const typeText: InvestmentInfo = resposta !== undefined ? textInvestment(resposta?.tipo) : {text: ''};
    console.log(resposta)
    function formatarReal(valor: string | number | undefined): string {
        const numero = typeof valor === "number" ? valor : Number(valor);
        if (isNaN(numero)) {
            return "";
        }
        return numero.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    return(
        <>
            <ThemeProvider theme={theme}>
            

                <CssBaseline />
                <AppBar sx={{backgroundColor: 'rgba(27, 33, 44, 1)', height: '90px', display: 'flex'}}>
                <Grid container gap={1} sx={{marginLeft: '40px', marginTop: '30px',}}>
                    <Box component="img" src="/static/investfix-logo.png" alt="Logo Investfix" sx={{width: '40px', height: '32px',}}/>
                    <Typography variant="body1" style={{ fontWeight: 'bold', fontSize: '23px', color: 'gold'}}> INVESTFIX</Typography>
                </Grid>                
                <Grid container sx={{marginRight:'40px', marginTop: '-35px', }} justifyContent="flex-end" >
                    <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => navigate('/')}>Home</Button>
                    <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => navigate('/calculator')}>Calculadora</Button>
                    <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => navigate('/simulator')}>Simulador</Button>  
                    <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => navigate('/investimentos')}>Investimentos</Button>
                    <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => {localStorage.setItem('scrollToSection', 'quem-somos');
                        window.location.href = '/'}}>Quem Somos</Button>
                    <Avatar alt="Nome do Usuário" src="/static/perfil-porquinho.png" sx={{ marginLeft: '30px'}}/>
                </Grid>
                </AppBar>                                        
                {
                    (!displayResponse) ? (
                        <Grid container gap={4} sx={{border: '1px solid white', background:'rgba(31, 32, 33, 1)', color: 'white', padding: '20px', marginLeft: 'auto', display: 'flex', flexDirection: 'column', marginRight: 'auto', width: '1100px', marginTop: '200px', borderRadius: '13px', boxShadow: 3, alignContent: 'center'}}>
                            <Typography sx={{color:'white', fontFamily:'Roboto', fontSize: '25px', fontWeight: 'bold', textAlign: 'center'}}>Preencha os campos:</Typography>
                            <Grid container gap={10}>
                                <Box display='grid' gap={2}>
                                    <Typography sx={{fontFamily:'Roboto', fontSize: '20px'}}>Quanto irá investir inicialmente?</Typography>
                                    <Box>
                                    <TextField sx={{...textFieldStyle('valor_inicial'), width: '300px'}} id="outlined-basic" label="R$" type="number" variant="outlined" 
                                    onKeyDown={(e) => {if(e.key === 'Enter') submit()}} onChange={(e) => setFormData({ ...formData, valor_inicial: e.target.value })}/>
                                    {incompleto.includes('valor_inicial') && (
                                        <Typography sx={{fontFamily:'Roboto', fontSize: '11px', color: 'red', marginTop: '8px'}}>Campo obrigatório</Typography>
                                    )}
                                    </Box>  
                                </Box>
                                <Box display='grid' gap={2}>
                                    <Typography sx={{fontFamily:'Roboto', fontSize: '20px'}}>Quanto irá investir por mês?</Typography>
                                    <Box>
                                        <TextField id="outlined-basic" type="number" label="R$" variant="outlined" sx={{...textFieldStyle('valor_mensal'), width: '300px'}}
                                            onChange={(e) => setFormData({ ...formData, valor_mensal: e.target.value})} onKeyDown={(e) => {if(e.key === 'Enter') submit()}}
                                            />
                                        {incompleto.includes('valor_mensal') && (
                                            <Typography sx={{fontFamily:'Roboto', fontSize: '11px', color: 'red', marginTop: '8px'}}>Campo obrigatório</Typography>
                                        )}
                                    </Box>     
                                </Box>
                                <Box display='grid' gap={2}>
                                    <Typography sx={{fontFamily:'Roboto', fontSize: '20px'}}>Por quanto tempo?</Typography>
                                    <Box >
                                    <TextField id="outlined-basic" type="number" label="Em meses" variant="outlined" sx={{...textFieldStyle('valor_mensal'), width: '200px'}}
                                        onChange={(e) => setFormData({ ...formData, prazo: e.target.value})} onKeyDown={(e) => {if(e.key === 'Enter') submit()}}
                                        />
                                    {incompleto.includes('prazo') && (
                                        <Typography sx={{fontFamily:'Roboto', fontSize: '11px', color: 'red', marginTop: '8px'}}>Campo obrigatório</Typography>
                                    )}
                                    </Box>
                                    
                                </Box>
                            </Grid>
                            <Grid container gap={15} >
                                <Box display='grid' >
                                    <Typography sx={{fontFamily:'Roboto', fontSize: '20px'}}>Precisará do dinheiro antes do prazo fornecido?</Typography>
                                    <RadioGroup
                                            row
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue="false"
                                            name="radio-buttons-group"
                                            sx={{justifyContent:'center'}}
                                            onChange={(e) =>setFormData({ ...formData, liquidez_diaria: e.target.value === 'true' })}
                                    >
                                            <FormControlLabel value="true" control={<Radio sx={{
                                                    color: 'white', 
                                                    '&.Mui-checked': {
                                                    color: 'white', 
                                                    },
                                                }}/>} label="Sim" sx={{color: 'white', '& .MuiFormControlLabel-label': {fontSize: '1.2rem', fontWeight: 'bold'}
                                            }}/>
                                            <FormControlLabel value="false" control={<Radio sx={{
                                                    color: 'white', 
                                                    '&.Mui-checked': {
                                                    color: 'white', 
                                                    },
                                                }}/>} label="Não" sx={{color: 'white', '& .MuiFormControlLabel-label': {fontSize: '1.2rem', fontWeight: 'bold'}
                                            }}/>
                                    </RadioGroup>                        
                                </Box>
                                <Box display='grid' gap={2}>
                                    <Typography sx={{fontFamily:'Roboto',fontSize: '20px'}}>Qual seu objetivo com o investimento?</Typography>
                                    <Box>
                                    <TextField id="outlined-basic" label="Ex.: viagem, aposentadoria..." variant="outlined" sx={{...textFieldStyle('objetivo'), width: '350px'}}
                                        onChange={(e) => setFormData({ ...formData, objetivo: e.target.value})} onKeyDown={(e) => {if(e.key === 'Enter') submit()}}
                                    />
                                    {incompleto.includes('objetivo') && (
                                        <Typography sx={{fontFamily:'Roboto', fontSize: '11px', color: 'red', marginTop: '8px'}}>Campo obrigatório</Typography>
                                    )}
                                    </Box>
                                    
                                </Box>
                            </Grid>
                            <Button sx={{color:'white', width: '50px', alignSelf:'center', textTransform: 'none', fontFamily:'Roboto',
                                fontSize: '20px', border: '0.5px solid white', padding: '5px 45px', marginTop: '30px', boxShadow: 2,
                            }} onClick={() => submit()}>Enviar</Button>
                        </Grid>
                    ) : (
                            <Grid>
                                {loading === true ? 
                                 <Grid container justifyContent="center" alignItems="center" sx={{height: '100vh',background: 'black'}}>         
                                                <CircularProgress/> </Grid>                        
                                            :
                                            
                                                (typeof resposta === 'string') ? (
                                                <Box sx={{border: '1px solid white', background:'rgba(31, 32, 33, 1)', position: 'absolute', top: '20%', color: 'white', padding: '30px 0', width: '650px', marginTop: '180px', borderRadius: '13px', boxShadow: 3, textAlign: 'center', justifySelf: 'center'}}>
                                                    <Typography sx={{ color: 'white', fontSize: '25px'}}>{resposta}</Typography>
                                                    <Button sx={{color:'white', width: '50px', justifySelf:'center', textTransform: 'none', fontFamily:'Roboto',
                                                            fontSize: '16px', border: '0.5px solid white', padding: '5px 45px', marginTop: '40px', boxShadow: 2}}
                                                            onClick={() => {setDisplayResponse(false); setResposta(undefined); limparForm()}}>Voltar</Button>
                                                </Box>)
                                                :
                                                (<Grid container gap={4} sx={{border: '1px solid white', background:'rgba(31, 32, 33, 1)', color: 'white', padding: '20px', marginLeft: 'auto', display: 'flex', flexDirection: 'column', marginRight: 'auto', width: '900px', marginTop: '120px', borderRadius: '13px', boxShadow: 3, alignContent: 'center'}}>
                                                    <Grid sx={{marginTop: '20px', marginBottom: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '5px'}} >
                                                        <Typography sx={{fontFamily:'Roboto', fontSize: '20px'}}>{`O melhor investimento para você é:`}</Typography>
                                                        <Typography sx={{fontFamily:'Roboto', fontSize: '20px'}}>{resposta?.tipo + ' '+ resposta?.titulo}</Typography>
                                                    </Grid>
                                                    <Grid sx={{margin: '20px'}}>
                                                        <Typography sx={{fontFamily:'Roboto', fontSize: '20px', marginBottom: '10px'}}>{`O que é ${resposta?.tipo}?`}</Typography>
                                                        {
                                                            (resposta?.tipo === 'CDB') ? (
                                                                <>
                                                                    <Typography sx={{fontFamily:'Roboto', fontSize: '20px', marginBottom: '20px', marginLeft: '20px'}}>{typeText.text}</Typography>
                                                                    {
                                                                        typeText.cdbs?.map((item, index) => (
                                                                            <Typography key={index} sx={{fontFamily:'Roboto', fontSize: '20px', marginLeft: '20px'}}>{item}</Typography>
                                                                        ))
                                                                    }
                                                                </>
                                                            ) :
                                                            (
                                                                <Typography sx={{fontFamily:'Roboto', fontSize: '20px', marginBottom: '20px', marginLeft: '20px'}}>{typeText.text}</Typography>
                                                            )
                                                        }
                                                        <Typography sx={{fontFamily:'Roboto', fontSize: '20px', marginTop: '20px'}}>{`Portanto, investindo inicialmente ${formatarReal(formData.valor_inicial)}, aplicando ${formatarReal(formData.valor_mensal)} 
                                                            mensalmente por ${formData.prazo} meses, rendendo anualmente ${resposta?.taxa}, no final terá feito
                                                             ${formatarReal(resposta?.valor_final_bruto)}, com lucro de ${formatarReal(resposta?.lucro_liquido)}.`}</Typography>
                                                    </Grid>
                                                    <Button sx={{color:'white', width: '50px', justifySelf:'center', marginLeft: 'auto', marginRight: 'auto', textTransform: 'none', fontFamily:'Roboto',
                                                                fontSize: '16px', border: '0.5px solid white', padding: '5px 45px', marginTop: '20px', boxShadow: 2}}
                                                                onClick={() => {setDisplayResponse(false); setResposta(undefined); limparForm()}}>Voltar</Button>
                                                </Grid>) 
                                            
                                }
                                </Grid>
                    )               
                }
                <Grid sx={{backgroundColor: 'rgba(27, 33, 44, 1)', position: 'fixed', bottom: 0, textAlign: 'center', height: '50px', alignContent: 'center', width: '100%'}}>
                    <Typography sx={{color: 'white', fontWeight: 'bold'}}>&copy; 2025 Malu Chen da Fonseca. Todos os direitos reservados</Typography>
                </Grid>
            </ThemeProvider>
        </>
    )
}