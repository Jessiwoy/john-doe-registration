// App.tsx

function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          John Doe Registration
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
          Cadastro de clientes
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
          Base inicial do formulário de cadastro. As regras de negócio,
          integração com API e persistência serão adicionadas nas próximas
          etapas.
        </p>
      </section>
    </main>
  )
}

export default App
