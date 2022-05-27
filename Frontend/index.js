function verSugestoes() {
    var aluno,cursoMatriculado,jaComprou,produtoComprado,frequenciaNaLoja;
    aluno = document.getElementById("aluno").value;
    cursoMatriculado = document.getElementById("cursoMatriculado").value;
    jaComprou = document.getElementById("jaComprou").value;
    produtoComprado = document.getElementById("produtoComprado").value;
    frequenciaNaLoja = document.getElementById("frequenciaNaLoja").value;
    $.ajax({
      url: `http://localhost:3000/getoptions?aluno=${aluno}&cursoMatriculado=${cursoMatriculado}&jaComprou=${jaComprou}&produtoComprado=${produtoComprado}&frequenciaNaLoja=${frequenciaNaLoja}`,
      type: "GET",
      success: function(response) {
        console.log(response);
        document.getElementById("primeiraSugestao").innerHTML = `Enviar e-mail marketing referente a ${response[0].registro.tipo_email} sobre o instrumento ${response[0].registro.instrumento_email}`;
        document.getElementById("segundaSugestao").innerHTML = `Enviar e-mail marketing referente a ${response[1].registro.tipo_email} sobre o instrumento ${response[1].registro.instrumento_email}`;
        document.getElementById("terceiraSugestao").innerHTML = `Enviar e-mail marketing referente a ${response[2].registro.tipo_email} sobre o instrumento ${response[2].registro.instrumento_email}`;
      },
      error: function(err) {
        console.log(err)
      }
    }) 
  }

  function criarRegistro() {
    var aluno,cursoMatriculado,jaComprou,produtoComprado,frequenciaNaLoja,instrumentoEmail,tipoEmail;
    aluno = document.getElementById("aluno").value;
    cursoMatriculado = document.getElementById("cursoMatriculado").value;
    jaComprou = document.getElementById("jaComprou").value;
    produtoComprado = document.getElementById("produtoComprado").value;
    frequenciaNaLoja = document.getElementById("frequenciaNaLoja").value;
    tipoEmail = document.getElementById("tipoEmail").value;
    instrumentoEmail = document.getElementById("instrumentoEmail").value;

    console.log(`http://localhost:3000/criar?${aluno}&${cursoMatriculado}&${jaComprou}&${produtoComprado}&${frequenciaNaLoja}&${tipoEmail}&${instrumentoEmail}`);
    $.ajax({
      url: `http://localhost:3000/criarregistro?aluno=${aluno}&cursoMatriculado=${cursoMatriculado}&jaComprou=${jaComprou}&produtoComprado=${produtoComprado}&frequenciaNaLoja=${frequenciaNaLoja}&tipo_email=${tipoEmail}&instrumento_email=${instrumentoEmail}`,
      type: "GET",
      success: function(response) {
        alert(response);
      },
      error: function(err) {
        console.log(err)
      }
    }) 
  }