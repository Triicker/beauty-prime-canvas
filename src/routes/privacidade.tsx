import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — LOMA Clinic & Beauty Hair" },
      {
        name: "description",
        content:
          "Política de privacidade e proteção de dados pessoais da LOMA Clinic & Beauty Hair, em conformidade com o RGPD.",
      },
      { property: "og:title", content: "Política de Privacidade — LOMA Clinic & Beauty Hair" },
      { property: "og:url", content: "https://lomaexperience.com/privacidade" },
    ],
    links: [{ rel: "canonical", href: "https://lomaexperience.com/privacidade" }],
  }),
  component: Privacidade,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="mb-10">
        <h2 className="font-display text-xl text-foreground mb-3">{title}</h2>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
      </div>
    </Reveal>
  );
}

function Privacidade() {
  return (
    <div className="pt-16 pb-24">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <SectionHeading eyebrow="Legal" title="Política de Privacidade" />

        <Reveal>
          <p className="text-sm text-muted-foreground mb-10">
            Última atualização: 27 de maio de 2026
          </p>
        </Reveal>

        <Section title="1. Responsável pelo Tratamento de Dados">
          <p>
            <strong className="text-foreground">LOMA Clinic & Beauty Hair</strong>
            <br />
            Fundadora: Marina Loreti
            <br />
            Morada: R. da Azenha 6, 2560-474 Silveira, Torres Vedras
            <br />
            NIF: 233249168
            <br />
            Email:{" "}
            <a
              href="mailto:Lomahairspa@gmail.com"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Lomahairspa@gmail.com
            </a>
            <br />
            Telefone: +351 913 016 182
          </p>
        </Section>

        <Section title="2. Dados Pessoais Recolhidos">
          <p>
            Através dos formulários presentes no site (contacto, agendamento, candidatura de
            profissionais), podemos recolher os seguintes dados:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Nome completo</li>
            <li>Endereço de email</li>
            <li>Número de telefone</li>
            <li>Mensagens e notas adicionais fornecidas voluntariamente</li>
          </ul>
          <p className="mt-2">
            Não recolhemos dados de pagamento — o processamento de pagamentos é feito exclusivamente
            de forma presencial.
          </p>
        </Section>

        <Section title="3. Finalidade e Base Legal do Tratamento">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong className="text-foreground">Responder a pedidos de contacto:</strong>{" "}
              consentimento do titular (Art. 6.º n.º 1 al. a) RGPD)
            </li>
            <li>
              <strong className="text-foreground">Gerir agendamentos:</strong> execução de contrato
              ou diligências pré-contratuais (Art. 6.º n.º 1 al. b) RGPD)
            </li>
            <li>
              <strong className="text-foreground">Processar candidaturas de profissionais:</strong>{" "}
              consentimento do titular (Art. 6.º n.º 1 al. a) RGPD)
            </li>
          </ul>
        </Section>

        <Section title="4. Prazo de Conservação">
          <p>
            Os dados pessoais são conservados pelo período mínimo necessário ao cumprimento da
            finalidade para que foram recolhidos, não excedendo{" "}
            <strong className="text-foreground">12 meses</strong> após o último contacto ou
            agendamento, salvo obrigação legal que imponha prazo diferente.
          </p>
        </Section>

        <Section title="5. Partilha de Dados com Terceiros">
          <p>
            Os seus dados pessoais não são vendidos, alugados ou partilhados com terceiros para fins
            comerciais ou de marketing. Apenas poderão ser comunicados a entidades públicas quando
            exigido por lei.
          </p>
        </Section>

        <Section title="6. Armazenamento Local (localStorage)">
          <p>
            Este site utiliza o armazenamento local do browser (<em>localStorage</em>) — uma
            tecnologia semelhante aos cookies — para:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Guardar a preferência de idioma (PT / EN / FR)</li>
            <li>Guardar temporariamente os produtos adicionados ao carrinho de compras</li>
            <li>Registar o seu consentimento para utilização do armazenamento local</li>
          </ul>
          <p className="mt-2">
            Estes dados são guardados exclusivamente no seu dispositivo e não são transmitidos para
            os nossos servidores. Pode apagá-los a qualquer momento através das definições do seu
            browser.
          </p>
        </Section>

        <Section title="7. Serviços de Terceiros">
          <p>
            O site utiliza tipografia carregada via{" "}
            <strong className="text-foreground">Google Fonts</strong>. A Google pode registar
            pedidos de carregamento de fontes. Consulte a{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Política de Privacidade da Google
            </a>{" "}
            para mais informações.
          </p>
          <p className="mt-2">
            O site contém ligações para redes sociais externas (Instagram, Facebook). Ao clicar
            nessas ligações, passa a estar sujeito às políticas de privacidade dessas plataformas.
          </p>
        </Section>

        <Section title="8. Direitos do Titular dos Dados">
          <p>Nos termos do RGPD (Regulamento UE 2016/679), tem direito a:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong className="text-foreground">Acesso</strong> — saber quais os dados que
              guardamos sobre si
            </li>
            <li>
              <strong className="text-foreground">Retificação</strong> — corrigir dados incorretos
              ou incompletos
            </li>
            <li>
              <strong className="text-foreground">Apagamento</strong> — solicitar a eliminação dos
              seus dados ("direito ao esquecimento")
            </li>
            <li>
              <strong className="text-foreground">Limitação</strong> — restringir o tratamento dos
              seus dados
            </li>
            <li>
              <strong className="text-foreground">Portabilidade</strong> — receber os seus dados num
              formato estruturado e legível
            </li>
            <li>
              <strong className="text-foreground">Oposição</strong> — opor-se ao tratamento dos seus
              dados
            </li>
            <li>
              <strong className="text-foreground">Reclamação</strong> — apresentar queixa à{" "}
              <a
                href="https://www.cnpd.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-primary transition-colors"
              >
                Comissão Nacional de Proteção de Dados (CNPD)
              </a>
            </li>
          </ul>
          <p className="mt-2">
            Para exercer qualquer destes direitos, contacte-nos por email:{" "}
            <a
              href="mailto:Lomahairspa@gmail.com"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Lomahairspa@gmail.com
            </a>
          </p>
        </Section>

        <Section title="9. Segurança">
          <p>
            Adotamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais
            contra acesso não autorizado, perda, destruição ou divulgação acidental.
          </p>
        </Section>

        <Section title="10. Alterações a esta Política">
          <p>
            Reservamo-nos o direito de atualizar esta Política de Privacidade. Qualquer alteração
            relevante será comunicada através do site. A data de "última atualização" no topo desta
            página reflete sempre a versão mais recente.
          </p>
        </Section>
      </div>
    </div>
  );
}
