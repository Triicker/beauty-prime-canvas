import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos e Condições — LOMA Clinic & Beauty Hair" },
      {
        name: "description",
        content:
          "Termos e condições de utilização do site e dos serviços da LOMA Clinic & Beauty Hair.",
      },
      { property: "og:title", content: "Termos e Condições — LOMA Clinic & Beauty Hair" },
      { property: "og:url", content: "https://lomaexperience.com/termos" },
    ],
    links: [{ rel: "canonical", href: "https://lomaexperience.com/termos" }],
  }),
  component: Termos,
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

function Termos() {
  return (
    <div className="pt-16 pb-24">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <SectionHeading eyebrow="Legal" title="Termos e Condições" />

        <Reveal>
          <p className="text-sm text-muted-foreground mb-10">
            Última atualização: 27 de maio de 2026
          </p>
        </Reveal>

        <Section title="1. Identificação">
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

        <Section title="2. Objeto e Aceitação">
          <p>
            Os presentes Termos e Condições regulam o acesso e utilização do site{" "}
            <strong className="text-foreground">lomaexperience.com</strong> e dos serviços prestados
            pela LOMA Clinic & Beauty Hair. Ao aceder ao site, o utilizador declara ter lido,
            compreendido e aceite estes termos.
          </p>
        </Section>

        <Section title="3. Serviços Prestados">
          <p>A LOMA Clinic & Beauty Hair presta serviços nas seguintes áreas:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Corte e styling de cabelo</li>
            <li>Coloração e técnicas de cor</li>
            <li>Tratamentos capilares e Head Spa</li>
            <li>Alisamento e queratina</li>
            <li>Estética e bem-estar</li>
            <li>Venda de produtos de beleza</li>
          </ul>
          <p className="mt-2">
            Os serviços disponíveis, preços e condições podem ser consultados na{" "}
            <Link
              to="/servicos"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              página de Serviços
            </Link>{" "}
            e estão sujeitos a alteração sem aviso prévio.
          </p>
        </Section>

        <Section title="4. Agendamentos">
          <p>
            Os agendamentos realizados através do site são sujeitos a confirmação pela LOMA. A
            confirmação será efetuada por telefone ou email no prazo de 24 horas úteis.
          </p>
          <p className="mt-2 font-medium text-foreground">Política de cancelamento:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Cancelamentos devem ser comunicados com um mínimo de{" "}
              <strong className="text-foreground">24 horas de antecedência</strong>
            </li>
            <li>
              Cancelamentos com menos de 24 horas poderão estar sujeitos a uma taxa de cancelamento
            </li>
            <li>
              Em caso de não comparência repetida sem aviso, a LOMA reserva-se o direito de
              solicitar depósito de confirmação para agendamentos futuros
            </li>
          </ul>
        </Section>

        <Section title="5. Loja Online e Produtos">
          <p>
            A loja online apresenta produtos de beleza disponíveis para consulta. Os preços
            indicados são em Euros (€) e incluem IVA à taxa legal em vigor.
          </p>
          <p className="mt-2">
            <strong className="text-foreground">Nota:</strong> O checkout online encontra-se em fase
            de implementação. As compras de produtos são atualmente efetuadas presencialmente ou
            através de contacto direto com o salão.
          </p>
          <p className="mt-2">
            A LOMA reserva-se o direito de alterar preços e disponibilidade de produtos sem aviso
            prévio.
          </p>
        </Section>

        <Section title="6. Propriedade Intelectual">
          <p>
            Todo o conteúdo presente neste site — incluindo textos, imagens, fotografias, design,
            logótipo e marca — é propriedade da LOMA Clinic & Beauty Hair ou dos seus fornecedores
            de conteúdo e está protegido pela legislação portuguesa e europeia de propriedade
            intelectual.
          </p>
          <p className="mt-2">
            É proibida a reprodução, distribuição ou utilização deste conteúdo sem autorização
            prévia e expressa por escrito.
          </p>
        </Section>

        <Section title="7. Limitação de Responsabilidade">
          <p>A LOMA Clinic & Beauty Hair não se responsabiliza por danos resultantes de:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Informação incorreta fornecida pelo utilizador nos formulários</li>
            <li>Indisponibilidade temporária do site por razões técnicas fora do seu controlo</li>
            <li>Utilização indevida do site por parte de terceiros</li>
          </ul>
        </Section>

        <Section title="8. Privacidade e Proteção de Dados">
          <p>
            O tratamento de dados pessoais é regido pela nossa{" "}
            <Link
              to="/privacidade"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Política de Privacidade
            </Link>
            , em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD — Regulamento
            UE 2016/679).
          </p>
        </Section>

        <Section title="9. Lei Aplicável e Foro Competente">
          <p>
            Os presentes Termos e Condições são regidos pela legislação portuguesa. Em caso de
            litígio, as partes submetem-se à competência do Tribunal da Comarca de Torres Vedras,
            com expressa renúncia a qualquer outro foro.
          </p>
          <p className="mt-2">
            Para resolução alternativa de litígios, o utilizador pode recorrer ao{" "}
            <a
              href="https://www.consumidor.gov.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Portal do Consumidor
            </a>{" "}
            (www.consumidor.gov.pt).
          </p>
        </Section>

        <Section title="10. Alterações aos Termos">
          <p>
            A LOMA reserva-se o direito de alterar estes Termos e Condições a qualquer momento. As
            alterações entram em vigor no momento da sua publicação no site. Recomendamos a consulta
            periódica desta página.
          </p>
        </Section>
      </div>
    </div>
  );
}
