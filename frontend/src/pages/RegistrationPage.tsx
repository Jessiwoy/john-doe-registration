// RegistrationPage.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  clientRegistrationSchema,
  type ClientRegistrationFormData,
} from '../schemas/clientRegistrationSchema';
import { formatCpf } from '../utils/cpf';

const colorOptions: Array<{ id: string; name: string }> = [];

function RegistrationPage() {
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<ClientRegistrationFormData>({
    resolver: zodResolver(clientRegistrationSchema),
    defaultValues: {
      fullName: '',
      cpf: '',
      email: '',
      favoriteColorId: '',
      observations: '',
    },
  });
  const observationsLength = watch('observations')?.length ?? 0;
  const cpfField = register('cpf');

  function handleValidSubmit() {
    return undefined;
  }

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

        <form
          className="w-full rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8"
          onSubmit={handleSubmit(handleValidSubmit)}
        >
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
                aria-describedby={
                  errors.fullName ? 'fullName-error' : undefined
                }
                aria-invalid={Boolean(errors.fullName)}
                id="fullName"
                placeholder="John Doe"
                type="text"
                {...register('fullName')}
              />
              {errors.fullName ? (
                <p className="mt-2 text-sm text-red-700" id="fullName-error">
                  {errors.fullName.message}
                </p>
              ) : null}
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
                  aria-describedby={errors.cpf ? 'cpf-error' : undefined}
                  aria-invalid={Boolean(errors.cpf)}
                  id="cpf"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  type="text"
                  {...cpfField}
                  onChange={(event) => {
                    event.target.value = formatCpf(event.target.value);

                    void cpfField.onChange(event);
                  }}
                />
                {errors.cpf ? (
                  <p className="mt-2 text-sm text-red-700" id="cpf-error">
                    {errors.cpf.message}
                  </p>
                ) : null}
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
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={Boolean(errors.email)}
                  id="email"
                  placeholder="john@email.com"
                  type="email"
                  {...register('email')}
                />
                {errors.email ? (
                  <p className="mt-2 text-sm text-red-700" id="email-error">
                    {errors.email.message}
                  </p>
                ) : null}
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
                aria-describedby={
                  errors.favoriteColorId ? 'favoriteColorId-error' : undefined
                }
                aria-invalid={Boolean(errors.favoriteColorId)}
                defaultValue=""
                id="favoriteColorId"
                {...register('favoriteColorId')}
              >
                <option disabled value="">
                  Selecione uma cor
                </option>
                {colorOptions.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
              {errors.favoriteColorId ? (
                <p
                  className="mt-2 text-sm text-red-700"
                  id="favoriteColorId-error"
                >
                  {errors.favoriteColorId.message}
                </p>
              ) : null}
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
                aria-describedby={
                  errors.observations
                    ? 'observations-error observations-count'
                    : 'observations-count'
                }
                aria-invalid={Boolean(errors.observations)}
                id="observations"
                maxLength={5000}
                placeholder="Inclua detalhes importantes sobre o cliente."
                {...register('observations')}
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-zinc-500">
                  <span className="text-red-600">*</span> Campos obrigatórios.
                </p>
                <p className="text-xs text-zinc-500" id="observations-count">
                  {observationsLength}/5000
                </p>
              </div>
              {errors.observations ? (
                <p
                  className="mt-2 text-sm text-red-700"
                  id="observations-error"
                >
                  {errors.observations.message}
                </p>
              ) : null}
            </div>

            <button
              className="mt-2 h-12 rounded-md bg-zinc-950 px-5 text-base font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
              type="submit"
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
