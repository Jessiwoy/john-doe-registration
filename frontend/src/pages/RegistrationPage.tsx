// RegistrationPage.tsx

function RegistrationPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-6 text-zinc-950 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-emerald-700">
            John Doe Registration
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl">
            Cadastro de clientes
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-700 sm:text-lg">
            Registre as informações essenciais do cliente para manter o
            cadastro organizado desde o primeiro contato.
          </p>
          <div className="mt-8 grid max-w-md grid-cols-3 gap-3" aria-hidden="true">
            <span className="h-2 rounded-full bg-red-500" />
            <span className="h-2 rounded-full bg-amber-400" />
            <span className="h-2 rounded-full bg-emerald-500" />
            <span className="h-2 rounded-full bg-sky-500" />
            <span className="h-2 rounded-full bg-indigo-600" />
            <span className="h-2 rounded-full bg-violet-600" />
          </div>
        </div>

        <form className="w-full rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="grid gap-5">
            <div>
              <label
                className="flex items-center justify-between gap-3 text-sm font-medium text-zinc-900"
                htmlFor="fullName"
              >
                <span>
                  Nome completo <span className="text-red-600">*</span>
                </span>
              </label>
              <input
                className="mt-2 h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-base outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                type="text"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  className="flex items-center justify-between gap-3 text-sm font-medium text-zinc-900"
                  htmlFor="cpf"
                >
                  <span>
                    CPF <span className="text-red-600">*</span>
                  </span>
                </label>
                <input
                  className="mt-2 h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-base outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  id="cpf"
                  inputMode="numeric"
                  name="cpf"
                  placeholder="000.000.000-00"
                  type="text"
                />
              </div>

              <div>
                <label
                  className="flex items-center justify-between gap-3 text-sm font-medium text-zinc-900"
                  htmlFor="email"
                >
                  <span>
                    E-mail <span className="text-red-600">*</span>
                  </span>
                </label>
                <input
                  className="mt-2 h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-base outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  id="email"
                  name="email"
                  placeholder="john@email.com"
                  type="email"
                />
              </div>
            </div>

            <div>
              <label
                className="flex items-center justify-between gap-3 text-sm font-medium text-zinc-900"
                htmlFor="favoriteColorId"
              >
                <span>
                  Cor preferida <span className="text-red-600">*</span>
                </span>
              </label>
              <select
                className="mt-2 h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-base outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                defaultValue=""
                id="favoriteColorId"
                name="favoriteColorId"
              >
                <option disabled value="">
                  Selecione uma cor
                </option>
              </select>
            </div>

            <div>
              <label
                className="flex items-center justify-between gap-3 text-sm font-medium text-zinc-900"
                htmlFor="observations"
              >
                Observações
              </label>
              <textarea
                className="mt-2 min-h-36 w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-3 text-base outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                id="observations"
                maxLength={5000}
                name="observations"
                placeholder="Inclua detalhes importantes sobre o cliente."
              />
              <p className="mt-2 text-xs text-zinc-500">
                <span className="text-red-600">*</span> Campos obrigatórios.
              </p>
            </div>

            <button
              className="mt-2 h-12 rounded-md bg-zinc-950 px-5 text-base font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
              type="button"
            >
              Enviar cadastro
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default RegistrationPage;
