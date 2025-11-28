import { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import {AppBar, Box, Button, Typography, Avatar, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead,
        TableRow, Paper} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { NumericFormat, NumberFormatValues } from "react-number-format";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function Simulator(){
    type Investimento = {
        tipo: string,
        valor_final_bruto: number,
        valor_final_liquido: number,
        lucro: number,
        lucro_liquido: number,
        imposto_pago: number,
        total_investido: number
    };

    interface Item {
    name: string;
    value: number;
    }

    type RowData = {
        name: string;
        final_bruto: number, 
        final_liquido: string,
        lucro: number,
        imposto: number,
        total_investido: number,
    };
    type Column = {
        id: keyof RowData;
        label: string;
    }   
    const [resposta, setResposta] = useState<Investimento[] | undefined>()
    const table = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<Item[]>(
    [{ name: "CDB", value: 0},
    { name: "Tesouro Selic", value: 0 },
    { name: "LCI", value: 0 },
    { name: "Tesouro IPCA", value: 0 },
    { name: "Poupança", value: 0 }])
    const [displayTable, setDisplayTable] = useState(false)
    const [rendimentos, setRendimentos] = useState({'LCI e LCA (% do CDI)': 100, 'Tesouro Prefixado (% a.a)': 10, 'Tesouro Selic (% da selic)': 100,
         'Tesouro IPCA (% IPCA)': 100, 'CDB (% do CDI)': 100, 'Poupança (% a.a)': 6.17})
    const [usuario, setUsuario] = useState<Record<string, string>>({
        'Valor inicial': "0,00",
        'Aporte mensal': "0,00",
        'Meses investindo': "0",
    });
    const [rows, setRows] = useState<RowData[] | undefined>()
    const theme = createTheme({
        palette:{
            background:{
                default: 'black'
            }
        }
    })
    const columns: Column[] = [
        { id: "name", label: "Aplicação" },
        { id: "final_bruto", label: "Valor Final Bruto" },
        { id: "final_liquido", label: "Valor Final Líquido"},
        { id: "lucro", label: "Lucro"},
        { id: "imposto", label: "Imposto Pago"},
        { id: "total_investido", label: "Total Investido"},
    ];

    function rowsTable(investimentos: Investimento[]){
        return investimentos.map((item) => {
            let name;

            if (item.tipo.includes('LCI')) {
                name = 'LCI e LCA';
            } else if (item.tipo.includes('CDI') && !item.tipo.includes('LCI')) {
                name = 'CDB';
            } else if (item.tipo.includes('Prefixado')) {
                name = 'Tesouro Prefixado';
            } else if (item.tipo.includes('Poupança')) {
                name = 'Poupança';
            } else if (item.tipo.includes('IPCA')) {
                name = 'Tesouro IPCA';
            } else if (item.tipo.includes('Selic')) {
                name = 'Tesouro Selic';
            } else {
                name = item.tipo; 
            }
            return { name, final_bruto: item.valor_final_bruto, final_liquido: "R$ " + item.valor_final_liquido.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, "."), 
                    lucro: item.lucro_liquido, imposto: item.imposto_pago, total_investido: item.total_investido}
        })
    }

    function charts(investimentos: Investimento[]) {
        return investimentos.map((item: { tipo: string; valor_final_liquido: number }) => {
            let name;

            if (item.tipo.includes('LCI')) {
                name = 'LCI e LCA';
            } else if (item.tipo.includes('CDI') && !item.tipo.includes('LCI')) {
                name = 'CDB';
            } else if (item.tipo.includes('Prefixado')) {
                name = 'Tesouro Prefixado';
            } else if (item.tipo.includes('Poupança')) {
                name = 'Poupança';
            } else if (item.tipo.includes('IPCA')) {
                name = 'Tesouro IPCA';
            } else if (item.tipo.includes('Selic')) {
                name = 'Tesouro Selic';
            } else {
                name = item.tipo; 
            }

            return {
                name,
                value: item.valor_final_liquido
            };
        });
    }


    useEffect(() => {
        const todosPreenchidos = Object.values(usuario).every((valor) => valor !== "0" && valor !== "0,00" && valor !== '');
        if (todosPreenchidos === true) {
            axios.post('http://127.0.0.1:5000/compare', {
            body: {
                usuario: usuario,
                investimentos: rendimentos
            }
            })
            .then(response => {setResposta(response.data);
                setData(charts(response.data))
            })
            .catch((error) => {
                console.error('Erro ao enviar requisição:', error);
            })
            .finally(() => {
                setDisplayTable(true);
                console.log('Requisição finalizada');
            });
        }
    }, [usuario, rendimentos])

    useEffect(() => {
        resposta !== undefined && setRows(rowsTable(resposta));
    }, [resposta])
    

    const handleValueChange = (name: string, values: NumberFormatValues) => {
        setUsuario((prev) => ({
        ...prev,
        [name]: values.formattedValue,
        }));
    };

    const handleChange = (name: string, e: string) => {
        setRendimentos((prev) => ({
        ...prev,
        [name]: e,
        }));
    }
 

    const handleFocus = (name: string) => {
        setUsuario((prev) => {
            if (prev[name] === '0,00' || prev[name] === '0' || prev[name] === 'R$ 0,00') return { ...prev, [name]: '' };
            return prev;
        });
    };

    const handleBlur = (name: string) => {
        setUsuario((prev) => {
            if (!prev[name] || prev[name].trim() === '')
            return { ...prev, [name]: name === 'Meses investindo' ? "0" : "0,00" };
            return prev;
        });
    };
    const inputsLabels = ['Valor inicial', 'Aporte mensal', 'Meses investindo']
    const taxas = {'CDI (a.a)': '14,90%', 'Selic (a.a)': '14,90%', 'IPCA (a.a)': '4,06%'} 
    const maxValue = Math.max(...data.map(d => d.value));
    const navigate = useNavigate();
    const rolarParaSecao = () => {
        table.current?.scrollIntoView({ behavior: "smooth" });
    }; 

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

                <Grid sx={{marginTop: '140px', border: '1px solid #e1ebeb3a',paddingLeft: '30px', width: '80rem', justifySelf: 'center', textAlign: 'center', height: '40rem'}}>
                    <Typography sx={{color: 'white', marginTop: '30px', fontSize: '25px'}}> Qual aplicação rende mais?</Typography>
                    <Grid container gap={6}>
                        <Box sx={{marginTop: '60px'}}>
                            <Grid container gap={5} sx={{marginTop: '60px', justifySelf: 'left'}}>
                            {
                                inputsLabels.map((item, index) => (
                                    <NumericFormat
                                        key={index} value={usuario[item]} thousandSeparator="." decimalSeparator={item === 'Meses investindo' ? '' : ","} 
                                        prefix={item === 'Meses investindo' ? "": "R$ "} 
                                        label={item} customInput={TextField} variant="outlined"
                                        decimalScale={item === 'Meses investindo' ? undefined : 2} 
                                        onValueChange={(values) => handleValueChange(item, values)}
                                        onFocus={() => handleFocus(item)}
                                        onBlur={() => handleBlur(item)} 
                                        slotProps={{inputLabel: {shrink: true}}}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'gold', // borda normal
                                                    width: '198px'
                                                },
                                                '&.Mui-focused': {
                                                    color: '#FFD700', fontWeight:'bold',// cor do label quando o campo está focado
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'gold', // borda ao passar o mouse
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'gold', // borda quando focado
                                                },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: 'gold', fontWeight:'bold',// cor do label
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: '#FFD700', // cor da label quando focada
                                                    fontWeight: 'bold',
                                                },
                                                '& input': {
                                                    color: 'gold', // cor do texto digitado
                                                }}} /> ))}
                        </Grid>
                        <Grid container gap={5} sx={{marginTop: '40px', justifySelf: 'left'}}>
                            {
                                Object.entries(taxas).map(([chave, valor], index) => ( 
                                    <TextField
                                    key={index}
                                    disabled
                                    sx={{width: '198px', height: '56px',
                                    input: { color: 'gold'},
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {borderColor: 'gold'},
                                        '&.Mui-focused fieldset': {borderColor: 'gold'},
                                        '&.Mui-disabled fieldset': { background: 'rgba(212, 203, 178, 0.31)' }, // mantém borda dourada
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'gold', fontWeight: 'bold', marginTop: '15px', // cor normal do label
                                    },
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: 'gold', opacity: 1, paddingTop: '30px', marginBottom: '-13px', fontWeight: 'bold'
                                    },
                                    }}
                                    label={chave} variant="outlined" value={valor}
                                    />
                                    
                                ))
                            }
                        </Grid>
                        <Grid container spacing={5} sx={{width: '665px', height: '56px', justifySelf: 'left', marginTop: '40px'}}>
                            {Object.entries(rendimentos).map(([chave, valor], index) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <TextField
                                    label={chave}
                                    value={valor}
                                    onChange={(e) => handleChange(chave, e.target.value)}
                                    sx={{
                                    width: '198px',
                                    input: { color: 'gold' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'gold' },
                                        '&:hover fieldset': { borderColor: 'gold' },
                                        '&.Mui-focused fieldset': { borderColor: 'gold' },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'gold', fontWeight:'bold',

                                    },
                                    }}
                                />
                                </Grid>
                            ))}
                        </Grid>
                </Box>
                <Box sx={{justifySelf: 'right', marginTop: '60px', background: 'rgba(241, 235, 235, 0.19)', width: '520px', borderRadius:'10px', height: '500px'}}>
                    <Typography sx={{color: 'white', fontSize: '20px', paddingTop: '20px'}}>Total investido: {resposta?.[0].total_investido}</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 20, right: 30, left: -20, bottom: 20 }}
                        barCategoryGap="20%"
                        >
                        <XAxis type="number" domain={[0, maxValue]} hide/>
                        <YAxis type="category" dataKey="name" width={180}  tick={{ dx: -5, fill: "white" }}/>
                        <Tooltip cursor={{ width: 340 }}/>
                        <Bar dataKey="value" fill="#8884d8" name="Valor acumulado" />
                    </BarChart>
                    </ResponsiveContainer>
                    {displayTable && (
                        <Button sx={{color:'gold', fontWeight: 'bold',textTransform: 'none', border: '1px solid gold', padding: '4px 20px', marginRight: '320px',
                            '&:hover': {color: 'black', fontWeight: 'bold', backgroundColor: 'gold'}}} onClick={rolarParaSecao}>
                        Ver detalhes</Button>
                    )}
                    
                </Box>
           
                    </Grid>
                    
                </Grid> 

                {displayTable && (
                    <TableContainer component={Paper} sx={{ width: '80%', justifySelf: 'center', marginTop: '90px', background: 'rgba(31, 32, 33, 1)', marginBottom: '90px'}}
                 ref={table}>
                    <Table>
                         <TableHead>
                         <TableRow sx={{justifyContent: 'center'}}>
                             {columns.map((column, index) => (
                             <TableCell key={column.id} sx={{ color: 'white', fontWeight: 'bold', borderRight: index !== columns.length - 1 ? '1px solid gray' : 'none',
                                borderBottom: '1px solid gray', background: '#8884d8'
                             }}>
                                 {column.label}
                             </TableCell>
                             ))}
                         </TableRow>
                         </TableHead>

                         <TableBody>
                         {rows?.map((row, index) => (
                             <TableRow key={index}>
                             {columns.map((column, idx) => (
                                 <TableCell key={column.id} sx={{ color: 'white', borderRight: idx === columns.length - 1 ? 'none':'1px solid gray',
                                    borderBottom: index === rows.length - 1 ? 'none':'1px solid gray'
                                 }}>
                                 {row[column.id]}
                                 </TableCell>
                             ))}
                             </TableRow>
                         ))}
                         </TableBody>

                     </Table>
                 </TableContainer>  
                )}
             <Grid sx={{backgroundColor: 'rgba(27, 33, 44, 1)', position: 'fixed', bottom: 0, textAlign: 'center', height: '50px', alignContent: 'center', width: '100%'}}>
                    <Typography sx={{color: 'white', fontWeight: 'bold'}}>&copy; 2025 Malu Chen da Fonseca. Todos os direitos reservados</Typography>
                </Grid>     
            </ThemeProvider>
        </>
    )
}