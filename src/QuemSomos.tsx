import React from 'react';
import { Box, Typography, Grid, } from '@mui/material';
import {RocketLaunch, Balance, Security} from '@mui/icons-material';
export function QuemSomos(){
    return(
      <><Box id='quem-somos' sx={{ background: 'rgba(31, 32, 33, 1)', height: '50rem', padding: '40px', borderRadius: 2}}>
         <Box sx={{width: '1100px',  marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
            <Typography sx={{color:'gold', fontWeight: 'bold', fontSize: 23, marginTop: '40px'}}>INVESTFIX</Typography>
            <Typography sx={{color:'white', marginTop: '30px', fontFamily: 'Roboto', fontSize: 22, textIndent: '30px', textAlign: 'justify',
        textJustify: 'inter-word', lineHeight: 1.6}}>
              Na hora de investir, muitas pessoas ficam em dúvida entre renda fixa e renda variável. A verdade é que a renda fixa oferece mais previsibilidade, 
              menos riscos e maior tranquilidade, especialmente para quem está começando ou quer proteger seu patrimônio. Ao contrário da renda variável, que oscila com o mercado e pode gerar perdas inesperadas, 
              a renda fixa permite que você saiba exatamente o que esperar — e isso é ouro quando o assunto é planejamento financeiro. Mas não pense que renda fixa é tudo igual! Existem opções para todos os perfis de investidor: 
            </Typography>

            <Grid container gap={5} sx={{marginTop: '30px'}}>
              <Grid sx={{textAlign: 'center', justifySelf: 'left'}}>
                <Security sx={{color: 'white', fontSize: '40px'}}/>
                <Typography sx={{color: 'white'}}>Conservador</Typography>
                <Typography sx={{color: 'white'}}>Busca segurança acima de tudo</Typography>
                <Typography sx={{color: 'white'}}>Exs.: Tesouro Selic, CDB pós-fixado,</Typography>
                <Typography sx={{color:'white'}}>LCI / LCA, RDB</Typography>
              </Grid>
              <Grid sx={{textAlign: 'center', justifySelf: 'center'}}>
                <Balance sx={{color: 'white',fontSize: '40px'}}/>
                <Typography sx={{color: 'white'}}>Moderado</Typography>
                <Typography sx={{color: 'white'}}>Quer equilibrar rentabilidade e risco</Typography>
                <Typography sx={{color: 'white'}}>Exs.: Tesouro IPCA+, CDB IPCA+</Typography>
                <Typography sx={{color:'white'}}>e pré-fixado, LF, LIG, Debênture</Typography>              
              </Grid>
              <Grid sx={{textAlign: 'center', justifySelf: 'right'}}>
                <RocketLaunch sx={{color: 'white', fontSize: '40px'}}/>
                <Typography sx={{color: 'white'}}>Arrojado</Typography>
                <Typography sx={{color: 'white'}}>Topa ousar, mas com inteligência</Typography>
                <Typography sx={{color: 'white'}}>Exs.: Debênture, CRI, CRA</Typography>             
              </Grid>
            </Grid>

            <Typography sx={{color:'white', marginTop: '30px', fontFamily: 'Roboto', fontSize: 22, textIndent: '30px', textAlign: 'justify',
        textJustify: 'inter-word', 
        lineHeight: 1.6}}>
              Na InvestFix, nós facilitamos esse processo para você. Criamos uma calculadora inteligente de renda fixa que analisa seu perfil e recomenda os melhores investimentos com base nas suas preferências.
              Você só precisa preencher alguns campos de acordo com o que esteja buscando e com essas informações, nossa ferramenta calcula e indica qual tipo de renda fixa é ideal para você — tudo de forma clara, rápida e personalizada.
              Investir bem não precisa ser complicado. Com a InvestFix, você toma decisões seguras e inteligentes, mesmo sem entender tudo de finanças!
            </Typography>
        </Box>
        </Box>
      </>
    )
}