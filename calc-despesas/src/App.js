// Importando React, useState e useEffect do React
import React, { useState, useEffect } from 'react';
// Importando o arquivo de estilos CSS
import './App.css';

// Função para formatar o valor como moeda brasileira
function formatarValor(valor) {
  const valorNumerico = parseFloat(valor);

  if (!isNaN(valorNumerico)) {
    return valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  } else {
    return valor;
  }
}

// Componente principal da aplicação
function App() {
  // Definindo estado para o cadastro de receitas e despesas
  const [cadastro, setCadastro] = useState({
    nome: '',
    valor: '',
    tipo: 'Receita',
    pagoPor: '',
  });

  // Definindo estados para receitas e despesas
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);

  // Efeito useEffect para carregar dados do localStorage ao iniciar a aplicação
  useEffect(() => {
    const localStorageReceitas = JSON.parse(localStorage.getItem('receitas')) || [];
    const localStorageDespesas = JSON.parse(localStorage.getItem('despesas')) || [];

    setReceitas(localStorageReceitas);
    setDespesas(localStorageDespesas);
  }, []);

  // Função para lidar com a mudança nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCadastro((prevCadastro) => ({
      ...prevCadastro,
      [name]: name === 'valor' ? formatarValor(value) : value,
    }));
  };

  // Função para adicionar um novo registro de receita ou despesa
  const handleAdicionar = () => {
    if (cadastro.nome && cadastro.valor && cadastro.tipo && cadastro.pagoPor) {
      const novoRegistro = { ...cadastro };

      if (cadastro.tipo === 'Receita') {
        setReceitas((prevReceitas) => {
          const newReceitas = [...prevReceitas, novoRegistro];
          handleLocalStorage(newReceitas, despesas);
          return newReceitas;
        });
      } else {
        setDespesas((prevDespesas) => {
          const newDespesas = [...prevDespesas, novoRegistro];
          handleLocalStorage(receitas, newDespesas);
          return newDespesas;
        });
      }

      // Resetando o estado do cadastro
      setCadastro({
        nome: '',
        valor: '',
        tipo: 'Receita',
        pagoPor: '',
      });
    }
  };

  // Função para excluir um registro de receita ou despesa
  const handleExcluir = (index, tipo) => {
    if (tipo === 'Receita') {
      setReceitas((prevReceitas) => {
        const newReceitas = [...prevReceitas];
        newReceitas.splice(index, 1);
        handleLocalStorage(newReceitas, despesas);
        return newReceitas;
      });
    } else {
      setDespesas((prevDespesas) => {
        const newDespesas = [...prevDespesas];
        newDespesas.splice(index, 1);
        handleLocalStorage(receitas, newDespesas);
        return newDespesas;
      });
    }
  };

  // Função para atualizar o localStorage com as receitas e despesas
  const handleLocalStorage = (newReceitas, newDespesas) => {
    localStorage.setItem('receitas', JSON.stringify(newReceitas));
    localStorage.setItem('despesas', JSON.stringify(newDespesas));
  };

  // Função para calcular o total de receitas
  const calcularTotalReceitas = () => {
    return receitas.reduce((total, item) => total + parseFloat(item.valor.replace('R$', '').replace('.', '').replace(',', '.')), 0);
  };

  // Função para calcular o total de despesas
  const calcularTotalDespesas = () => {
    return despesas.reduce((total, item) => total + parseFloat(item.valor.replace('R$', '').replace('.', '').replace(',', '.')), 0);
  };

  // Função para lidar com a mudança nos checkboxes
  const handleCheckboxChange = (index, tipo) => {
    // Implemente conforme necessário
    console.log(`Checkbox alterado para o ${tipo} na posição ${index}`);
  };

  // Renderização do componente
  return (
    <div className="App">
      {/* Título da aplicação */}
      <h1>Cadastro de Receitas e Despesas</h1>
      {/* Formulário para adicionar novos registros */}
      <div className="form-container">
        <div className="form">
          <label>
            Nome:
            <input type="text" name="nome" value={cadastro.nome} onChange={handleChange} />
          </label>
          <label>
            Valor:
            <input type="text" name="valor" value={cadastro.valor} onChange={handleChange} />
          </label>
          <label>
            Tipo:
            <select className='campoSelect' name="tipo" value={cadastro.tipo} onChange={handleChange}>
              <option value="Receita">Receita</option>
              <option value="Despesa">Despesa</option>
            </select>
          </label>
          <label>
            Pago por:
            <input type="text" name="pagoPor" value={cadastro.pagoPor} onChange={handleChange} />
          </label>
          <button onClick={handleAdicionar}>Adicionar</button>
        </div>
      </div>

      {/* Listas de receitas e despesas */}
      <div className="lists-container">
        <div className="list">
          <h2>Receitas - Total:{formatarValor(calcularTotalReceitas())}</h2>
          <ul>
            {receitas.map((item, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(index, 'Receita')}
                />
                <p>Nome: {item.nome}</p>
                <p>Valor: {formatarValor(item.valor)}</p>
                <p>Paga por: {item.pagoPor}</p>
                <button onClick={() => handleExcluir(index, 'Receita')}>Excluir</button>
                <hr />
              </li>
            ))}
          </ul>
        </div>

        <div className="list">
          <h2>Despesas - Total:{formatarValor(calcularTotalDespesas())}</h2>
          <ul>
            {despesas.map((item, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(index, 'Despesa')}
                />
                <p>Nome: {item.nome}</p>
                <p>Valor: {formatarValor(item.valor)}</p>
                <p>Paga por: {item.pagoPor}</p>
                <button onClick={() => handleExcluir(index, 'Despesa')}>Excluir</button>
                <hr />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Exportando o componente principal
export default App;
