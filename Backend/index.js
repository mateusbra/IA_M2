const express = require('express');
const app = express();
const cors = require ("cors");
const port = 3000;
const firebase = require('firebase/app');
const {getDatabase, ref, get, child, set, push, onValue, query, limitToLast} = require('firebase/database');

const firebaseApp = firebase.initializeApp ({
    apiKey: "AIzaSyDpPZcibF6wLEwDWVG6DuZFCLNDaSAl7zo",
    authDomain: "ia-aula.firebaseapp.com",
    databaseURL: "https://ia-aula-default-rtdb.firebaseio.com",
    projectId: "ia-aula",
    storageBucket: "ia-aula.appspot.com",
    messagingSenderId: "279972787749",
    appId: "1:279972787749:web:22b30ad9d4b58f3993b1cc"
}, 'firebaseApp');

const db = getDatabase(firebaseApp);

function sim_local_freq(freq1,freq2){
    const pesos = [
1,	0.83	,0.7	,0.5	,0.3	,0.16	,0
,   0.83	,1	,0.83	,0.7	,0.5	,0.3	,0.16
,0.7	,0.83	,1	,0.83	,0.7	,0.5	,0.3
,0.5	,0.7	,0.83	,1	,0.83	,0.7	,0.5
,0.3	,0.5	,0.7	,0.83	,1	,0.83	,0.7
,0.16	,0.3	,0.5	,0.7	,0.83	,1	,0.83
,0	,0.16	,0.3	,0.5	,0.7	,0.83	,1
];
    return  pesos[Number(freq1)*7+Number(freq2)];
}

function sim_local_instr(freq1,freq2){
    switch(freq1){
        case "Violão":
            freq1 = 0;
            break;
        case "Violino":
            freq1 = 1;
            break;
        case "Guitarra":
            freq1 = 2;
            break;
        case "Bateria":
            freq1 = 3;
            break;
        case "Piano":
            freq1 = 4;
            break;
        default:
            freq1 = 0;
    }

    switch(freq2){
        case "Violão":
            freq2 = 0;
            break;
        case "Violino":
            freq2 = 1;
            break;
        case "Guitarra":
            freq2 = 2;
            break;
        case "Bateria":
            freq2 = 3;
            break;
        case "Piano":
            freq2 = 4;
            break;
        default:
            freq2 = 0;
    }
    const pesos = [
1	,0.4	,0.3	,0.05	,0.1,
0.4,	1,	0.2,	0.05,	0.1,
0.3,	0.2,	1,	0.3,	0.15,
0.05,	0.05,	0.3,	1,	0.1,
0.1,	0.1,	0.15,	0.1,	1,
    ];

    return  pesos[Number(freq1)*5+Number(freq2)];
}

async function insertData({aluno,cursoMatriculado,frequenciaNaLoja,jaComprou,produtoComprado,tipo_email,instrumento_email},db) {
  push(ref(db, 'Pessoas'), {
    aluno:aluno,
    cursoMatriculado:cursoMatriculado,
    jaComprouNaLoja:jaComprou,
    produtoComprado:produtoComprado,
    frequenciaNaLoja:frequenciaNaLoja,
    tipo_email:tipo_email,
    instrumento_email:instrumento_email,
  });
}


async function getOptions({aluno,cursoMatriculado,frequenciaNaLoja,jaComprou,produtoComprado},db){

    const objeto = {
        total_peso:-1,
        registro:{
            aluno,
            cursoMatriculado,
            frequenciaNaLoja,
            jaComprou,
            produtoComprado
        },
    }


    var opcoes = [objeto,objeto,objeto];
    var total_peso;
    var jaSetado;

    await get(ref(db, `Pessoas/`)).then((snapshot) => {

        if (snapshot.exists()) {

            Object.values(snapshot.val()).forEach((registro) => {
                jaSetado = false;
                
                opcoes.forEach((opcao,index)=>{
                    total_peso = 0;

                    if(aluno == registro.aluno){
                        total_peso = total_peso + 1 * 0.8;
                    }

                    if(cursoMatriculado == registro.cursoMatriculado){
                        total_peso = total_peso + 1 * sim_local_instr(registro.cursoMatriculado,cursoMatriculado);
                    }
                    
                    if(jaComprou == registro.jaComprou){
                        total_peso = total_peso + 1 * 0.5;
                    }

                    if(produtoComprado == registro.produtoComprado){
                        total_peso = total_peso + 1 * sim_local_instr(registro.produtoComprado,produtoComprado);
                    }
                    
                        total_peso = total_peso +  0.1 * sim_local_freq(registro.frequenciaNaLoja,frequenciaNaLoja);
                    

                    if(total_peso > opcao.total_peso && jaSetado===false){
                        opcoes[index] = {
                            total_peso: total_peso,
                            registro:{
                                aluno: registro.aluno,
                                cursoMatriculado: registro.cursoMatriculado,
                                frequenciaNaLoja: registro.frequenciaNaLoja,
                                jaComprou: registro.jaComprou,
                                produtoComprado: registro.produtoComprado,
                                tipo_email: registro.tipo_email,
                                instrumento_email: registro.instrumento_email,
                        }
                    }
                    jaSetado = true;
                }
                });
              });
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      })
    return opcoes;
}

app.use(cors());

app.get('/getoptions', async function(req, res) {

    const opcoes = await getOptions(req.query,db);

    res.send(opcoes);
});

app.get('/criarregistro', async function(req, res) {

    await insertData(req.query,db);

    res.send("registro criado!");
});

app.listen(port,function(){
    console.log(`API setada na porta ${port}`);
});
