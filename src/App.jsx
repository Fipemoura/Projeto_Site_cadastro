import React, { useState, useEffect } from 'react';

function App() {
  const [produtos, setProdutos] = useState(() => {
    const salvos = localStorage.getItem('produtos_refugio');
    return salvos ? JSON.parse(salvos) : [
      { id: 1, nome: "Mochila Tática Antares 45L", preco: 350.00, categoria: "Mochilas", estoque: 12 },
      { id: 2, nome: "Canivete Multi-ferramentas", preco: 150.00, categoria: "Ferramentas", estoque: 25 },
      { id: 3, nome: "Lanterna Militar 2000 Lumens", preco: 85.00, categoria: "Iluminação", estoque: 20 },
    ];
  });

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('Equipamentos');
  const [estoque, setEstoque] = useState('');
  const [idEditando, setIdEditando] = useState(null);

  useEffect(() => {
    localStorage.setItem('produtos_refugio', JSON.stringify(produtos));
  }, [produtos]);

  const formatarEEnviar = (e) => {
    e.preventDefault();

    if (!nome || !preco || !estoque) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    if (idEditando !== null) {
      const produtosAtualizados = produtos.map((prod) => {
        if (prod.id === idEditando) {
          return { ...prod, nome, preco: parseFloat(preco), categoria, estoque: parseInt(estoque) };
        }
        return prod;
      });
      setProdutos(produtosAtualizados);
      setIdEditando(null);
    } else {
      const novoProduto = {
        id: Date.now(),
        nome,
        preco: parseFloat(preco),
        categoria,
        estoque: parseInt(estoque)
      };
      setProdutos([...produtos, novoProduto]);
    }

    limparFormulario();
  };

  const prepararEdicao = (produto) => {
    setIdEditando(produto.id);
    setNome(produto.nome);
    setPreco(produto.preco);
    setCategoria(produto.categoria);
    setEstoque(produto.estoque);
  };

  const excluirProduto = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este equipamento?")) {
      const listaFiltrada = produtos.filter(prod => prod.id !== id);
      setProdutos(listaFiltrada);
    }
  };

  const limparFormulario = () => {
    setNome('');
    setPreco('');
    setCategoria('Equipamentos');
    setEstoque('');
    setIdEditando(null);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🌲 Último Refúgio - Sistema de Estoque</h1>
        <p>Painel de Controle de Produtos</p>
      </header>

      <div style={styles.conteudo}>
        <section style={styles.cardForm}>
          <h2>{idEditando ? 'Editar Equipamento 🛠️' : 'Cadastrar Novo Equipamento 🎒'}</h2>
          <form onSubmit={formatarEEnviar} style={styles.form}>
            <label style={styles.label}>Nome do Produto:</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Lanterna tática LED" style={styles.input} />

            <div style={styles.row}>
              <div style={styles.col}>
                <label style={styles.label}>Preço (R$):</label>
                <input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="0,00" style={styles.input} />
              </div>
              <div style={styles.col}>
                <label style={styles.labelMuted}>Estoque:</label>
                <input type="number" value={estoque} onChange={(e) => setEstoque(e.target.value)} placeholder="Qtd" style={styles.input} />
              </div>
            </div>

            <label style={styles.label}>Categoria:</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={styles.input}>
              <option value="Equipamentos">Equipamentos</option>
              <option value="Mochilas">Mochilas</option>
              <option value="Ferramentas">Ferramentas</option>
              <option value="Vestuário">Vestuário</option>
              <option value="Iluminação">Iluminação</option>
            </select>

            <div style={styles.botoesForm}>
              <button type="submit" style={idEditando ? styles.btnEditar : styles.btnSucesso}>
                {idEditando ? 'Salvar Alterações' : 'Cadastro Produto'}
              </button>
              {idEditando && (
                <button type="button" onClick={limparFormulario} style={styles.btnCancelar}>Cancelar</button>
              )}
            </div>
          </form>
        </section>

        <section style={styles.cardLista}>
          <h2>Equipamentos em Estoque ( {produtos.length} )</h2>
          {produtos.length === 0 ? (
            <p style={{ color: '#aaa', textAlign: 'center' }}>Nenhum produto cadastrado no inventário.</p>
          ) : (
            <div style={styles.tabelaContainer}>
              <table style={styles.tabela}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Nome</th>
                    <th style={styles.th}>Categoria</th>
                    <th style={styles.th}>Preço</th>
                    <th style={styles.th}>Estoque</th>
                    <th style={styles.thAcoes}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((prod) => (
                    <tr key={prod.id} style={styles.tr}>
                      <td style={styles.td}><strong>{prod.nome}</strong></td>
                      <td style={styles.td}><span style={styles.badge}>{prod.categoria}</span></td>
                      <td style={styles.td}>R$ {prod.preco.toFixed(2).replace('.', ',')}</td>
                      <td style={styles.td}>{prod.estoque} un</td>
                      <td style={styles.tdAcoesBtn}>
                        <button onClick={() => prepararEdicao(prod)} style={styles.btnAcaoEditar}>Editar</button>
                        <button onClick={() => excluirProduto(prod.id)} style={styles.btnAcaoExcluir}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#121619', color: '#f5f5f5', minHeight: '100vh', fontFamily: 'Arial, sans-serif', padding: '20px' },
  header: { textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #2e383f', paddingBottom: '10px' },
  conteudo: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', maxWidth: '1200px', margin: '0 auto' },
  cardForm: { flex: '1', minWidth: '300px', backgroundColor: '#1a2126', padding: '20px', borderRadius: '8px', border: '1px solid #2e383f', height: 'fit-content' },
  cardLista: { flex: '2', minWidth: '500px', backgroundColor: '#1a2126', padding: '20px', borderRadius: '8px', border: '1px solid #2e383f' },
  form: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '5px', color: '#4caf50', fontWeight: 'bold', fontSize: '14px', display: 'block' },
  labelMuted: { marginBottom: '5px', color: '#4caf50', fontWeight: 'bold', fontSize: '14px', display: 'block', textAlign: 'left' },
  input: { padding: '10px', marginBottom: '15px', backgroundColor: '#252f35', border: '1px solid #3a4a52', borderRadius: '4px', color: '#fff', fontSize: '16px', width: '100%', boxSizing: 'border-box' },
  row: { display: 'flex', flexDirection: 'row', gap: '15px', width: '100%' },
  col: { flex: '1', display: 'flex', flexDirection: 'column' },
  botoesForm: { display: 'flex', gap: '10px' },
  btnSucesso: { flex: 1, backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  btnEditar: { flex: 1, backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  btnCancelar: { backgroundColor: '#f44336', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer' },
  tabelaContainer: { overflowX: 'auto' },
  tabela: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  thRow: { backgroundColor: '#252f35' },
  th: { padding: '12px', textAlign: 'left', color: '#4caf50', borderBottom: '2px solid #3a4a52' },
  thAcoes: { padding: '12px', textAlign: 'center', color: '#4caf50', borderBottom: '2px solid #3a4a52' },
  tr: { borderBottom: '1px solid #2e383f' },
  td: { padding: '12px' },
  tdAcoesBtn: { padding: '12px', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' },
  badge: { backgroundColor: '#2e383f', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' },
  btnAcaoEditar: { backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  btnAcaoExcluir: { backgroundColor: '#f44336', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

export default App;