
const API_URL = 'http://localhost:3000/medicamentos';

const formulario = document.getElementById('form-medicamento');
const lista = document.getElementById('lista-medicamentos');
const mensagem = document.getElementById('mensagem');

const campoId = document.getElementById('medicamento-id');
const campoNome = document.getElementById('nome');
const campoPrincipioAtivo = document.getElementById('principioAtivo');
const campoQuantidade = document.getElementById('quantidade');
const campoPreco = document.getElementById('preco');

const btnNovo = document.getElementById('btn-novo');
const btnCancelar = document.getElementById('btn-cancelar');
const tituloFormulario = document.getElementById('titulo-formulario');

let medicamentos = [];

function mostrarMensagem(texto, tipo = 'sucesso') {
  mensagem.textContent = texto;
  mensagem.className = tipo;
  mensagem.hidden = false;
}

function esconderMensagem() {
  mensagem.hidden = true;
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

async function carregarMedicamentos() {
  lista.innerHTML = `
    <tr>
      <td colspan="5" class="empty-state">Carregando...</td>
    </tr>
  `;

  try {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
      throw new Error('Não foi possível carregar os medicamentos.');
    }

    medicamentos = await resposta.json();
    renderizarMedicamentos();
    atualizarResumo();
  } catch (erro) {
    lista.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          Não foi possível conectar à API. Confira se o back-end está rodando.
        </td>
      </tr>
    `;

    mostrarMensagem(erro.message, 'erro');
  }
}

function renderizarMedicamentos() {
  if (medicamentos.length === 0) {
    lista.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          Nenhum medicamento cadastrado.
        </td>
      </tr>
    `;
    return;
  }

  lista.innerHTML = '';

  medicamentos.forEach((medicamento) => {
    const linha = document.createElement('tr');

    const valores = [
      medicamento.nome,
      medicamento.principioAtivo,
      medicamento.quantidade,
      formatarPreco(medicamento.preco),
    ];

    valores.forEach((valor) => {
      const celula = document.createElement('td');
      celula.textContent = valor ?? '';
      linha.appendChild(celula);
    });

    const acoes = document.createElement('td');
    const botoes = document.createElement('div');
    botoes.className = 'action-buttons';

    const editar = document.createElement('button');
    editar.type = 'button';
    editar.className = 'btn-edit';
    editar.textContent = 'Editar';
    editar.addEventListener('click', () => editarMedicamento(medicamento.id));

    const excluir = document.createElement('button');
    excluir.type = 'button';
    excluir.className = 'btn-delete';
    excluir.textContent = 'Excluir';
    excluir.addEventListener('click', () => excluirMedicamento(medicamento.id));

    botoes.append(editar, excluir);
    acoes.appendChild(botoes);
    linha.appendChild(acoes);
    lista.appendChild(linha);
  });
}

function atualizarResumo() {
  document.getElementById('total-medicamentos').textContent =
    medicamentos.length;

  const unidades = medicamentos.reduce(
    (total, medicamento) => total + Number(medicamento.quantidade || 0),
    0,
  );

  const valor = medicamentos.reduce(
    (total, medicamento) =>
      total + Number(medicamento.quantidade || 0) * Number(medicamento.preco || 0),
    0,
  );

  document.getElementById('total-unidades').textContent = unidades;
  document.getElementById('valor-estoque').textContent = formatarPreco(valor);
}

function abrirFormulario(medicamento = null) {
  formulario.hidden = false;
  esconderMensagem();

  if (medicamento) {
    tituloFormulario.textContent = 'Editar medicamento';
    campoId.value = medicamento.id;
    campoNome.value = medicamento.nome;
    campoPrincipioAtivo.value = medicamento.principioAtivo;
    campoQuantidade.value = medicamento.quantidade;
    campoPreco.value = medicamento.preco;
  } else {
    tituloFormulario.textContent = 'Cadastrar medicamento';
    formulario.reset();
    campoId.value = '';
  }

  formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function fecharFormulario() {
  formulario.reset();
  campoId.value = '';
  formulario.hidden = true;
}

function editarMedicamento(id) {
  const medicamento = medicamentos.find((item) => item.id === id);

  if (medicamento) {
    abrirFormulario(medicamento);
  }
}

async function excluirMedicamento(id) {
  const confirmar = confirm('Deseja realmente excluir este medicamento?');

  if (!confirmar) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!resposta.ok) {
      throw new Error('Não foi possível excluir o medicamento.');
    }

    mostrarMensagem('Medicamento excluído com sucesso!');
    await carregarMedicamentos();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
}

btnNovo.addEventListener('click', () => abrirFormulario());
btnCancelar.addEventListener('click', fecharFormulario);

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  esconderMensagem();

  const id = campoId.value;

  const dados = {
    nome: campoNome.value.trim(),
    principioAtivo: campoPrincipioAtivo.value.trim(),
    quantidade: Number(campoQuantidade.value),
    preco: Number(campoPreco.value),
  };

  if (
    !dados.nome ||
    !dados.principioAtivo ||
    campoQuantidade.value === '' ||
    campoPreco.value === '' ||
    !Number.isFinite(dados.quantidade) ||
    !Number.isFinite(dados.preco) ||
    dados.quantidade < 0 ||
    dados.preco < 0
  ) {
    mostrarMensagem('Preencha os campos corretamente.', 'erro');
    return;
  }

  try {
    const resposta = await fetch(
      id ? `${API_URL}/${id}` : API_URL,
      {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      },
    );

    if (!resposta.ok) {
      throw new Error('Não foi possível salvar. Confira a API e os campos.');
    }

    fecharFormulario();
    mostrarMensagem(
      id
        ? 'Medicamento atualizado com sucesso!'
        : 'Medicamento cadastrado com sucesso!',
    );

    await carregarMedicamentos();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
});

carregarMedicamentos();
