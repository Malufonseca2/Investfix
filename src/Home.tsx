import {useEffect, useState, useRef} from 'react';
import Grid from '@mui/material/Grid';
import { color, motion } from 'framer-motion';
import {AppBar, Box, Button, Typography, Avatar, CssBaseline} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom';
import { QuemSomos } from './QuemSomos';
import { fontWeight } from '@mui/system';

export default function Home(){
    const navigate = useNavigate();
    const theme = createTheme({
      palette: {
        background: {
          default: 'black', 
        },
      },
    });
  const [visible, setVisible] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const quemSomosRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  const buttonStyle = {color:'white', fontWeight: 'bold', fontSize: 20, textTransform: 'none', border: '1px solid white', borderRadius: '10px', padding: '8px 20px', 
        '&:hover': {
            transform: 'translateY(-4px)', 
            color: 'black',
            background: '#F5F5F5',
        }}

  const rolarParaSecao = (secao: React.RefObject<HTMLDivElement| null>) => {
    secao?.current?.scrollIntoView({ behavior: 'smooth' });
  };  
  useEffect(() => {
    const sectionId = localStorage.getItem('scrollToSection');
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        const yOffset = -100;
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      localStorage.removeItem('scrollToSection');
    }
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (boxRef.current) {
      observer.observe(boxRef.current);
    }

    return () => {
      if (boxRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(boxRef.current);
      }
    };
  }, []);
  
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
            
            <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => rolarParaSecao(homeRef)}>Home</Button>
            <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => navigate('/calculator')}>Calculadora</Button>  
            <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => navigate('/simulator')}>Simulador</Button>  
            <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => navigate('/investimentos')}>Investimentos</Button>
            <Button sx={{color: 'white', fontSize: '15px'}} onClick={() => rolarParaSecao(quemSomosRef)}>Quem Somos</Button>
            <Avatar alt="Nome do Usuário" src="/static/perfil-porquinho.png" sx={{ marginLeft: '30px'}}/>
          </Grid>
        </AppBar>

        <Grid ref={homeRef} sx={{ background: 'linear-gradient(gold, black)', marginTop: '90px', height: '740px', display: 'flex',
                  flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '30px', paddingBottom: '20px'}}>
               <Typography sx={{color:'white', fontWeight: 'bold', fontSize: 45, textAlign: 'center', marginTop:'200px' }}>Descubra o investimento mais seguro e ideal para você</Typography>
                <Typography sx={{color:'white', fontSize: 30, textAlign: 'center', marginTop:'-90px' }}> 
              Invista nos rendimentos mais seguros sendo iniciante no assunto.
            </Typography>
           
            <Box sx={{marginBottom: '60px', 
      }}>
                <Button sx={buttonStyle} onClick={() => navigate('/calculator')}>Começar</Button>
            </Box>
        </Grid>
           
        <motion.div
          ref={boxRef}
          initial={{ opacity: 0, y: 100 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <Box ref={quemSomosRef} id='quem-somos'>
            <QuemSomos/>
          </Box>

         
        </motion.div> 
        
        <Grid sx={{backgroundColor: 'rgba(27, 33, 44, 1)', textAlign: 'center', height: '50px', alignContent: 'center'}}>
          <Typography sx={{color: 'white', fontWeight: 'bold'}}>&copy; 2025 Malu Chen da Fonseca. Todos os direitos reservados</Typography>
        </Grid>
      </ThemeProvider>
      </>
        
        
    )
}