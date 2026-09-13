# Finanças a Dois (Versão Web)

Aplicação Web moderna, responsiva e pronta para produção construída em **React 18**, **TypeScript**, **Tailwind CSS** e **Vite**, focada na gestão financeira consolidada de casais.

---

## Recursos Implementados

1. **Visão Geral (Dashboard)**
   - Saldo conjunto em destaque no Hero Card.
   - Divisão transparente dos saldos individuais de **Lucas** e **Stefani**.
   - Indicadores operacionais mensais (Receitas, Despesas e Saldo Líquido).
   - Alertas visuais de contas fixas e recorrentes próximas ao vencimento (com badges de urgência e alternador de status pago/pendente).

2. **Módulo de Lançamentos**
   - Formulário completo para entrada de despesas ou receitas.
   - **Seletor obrigatório com as categorias pré-definidas**:
     - `IPTU`
     - `IPVA`
     - `Manutenção (Carro/Moto)`
     - `Cursos`
     - `Esportes`
     - `Lazer`
     - `Compras`
     - `Presentes`
   - Seletor de quem realizou o pagamento (*Lucas*, *Stefani* ou *Casal 50/50*), que recalcula o saldo individual e conjunto instantaneamente.
   - Histórico em tempo real com busca textual e filtros rápidos por categoria.

3. **Módulo de Metas (Goals)**
   - Focado especificamente nas categorias **"Casamento"** e **"Investimentos"**.
   - Barra de progresso geral e barras individuais dinâmicas com cálculo de valor faltante.
   - Histórico de aportes recentes realizados pelo casal.
   - Modal interativo para registrar novos aportes selecionando o valor e o contribuinte.

---

## Como Executar

### 1. Pré-requisitos
- Node.js versão 18 ou superior
- npm, yarn ou pnpm

### 2. Instalar dependências
```bash
cd web
npm install
```

### 3. Rodar em ambiente de desenvolvimento
```bash
npm run dev
```
Abra no navegador em [http://localhost:3000](http://localhost:3000).

### 4. Gerar build de produção
```bash
npm run build
```
Os arquivos otimizados serão gerados na pasta `web/dist/`, prontos para deploy no Vercel, Netlify, Cloud Run ou qualquer servidor estático.
