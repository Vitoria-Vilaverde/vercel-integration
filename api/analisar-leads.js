export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const leads = req.body;

  const respostas = leads.map(lead => {
    const margem = Number(lead.margem || lead.MARGEM || 0);
    const score = Number(lead.score || lead.SCORE || Math.random().toFixed(2));
    let estrategia = "";
    if (score > 0.7 && margem > 700) {
      estrategia = "Foque em margem alta e agende para o período da manhã.";
    } else if (score > 0.5) {
      estrategia = "Contato personalizado, priorize horário comercial.";
    } else {
      estrategia = "Oferta especial e reengajamento.";
    }
    return {
      cpf: lead.cpf || lead.CPF || "",
      nome: lead.nome || lead.NOME || "",
      margem,
      score,
      estrategia
    };
  });

  res.status(200).json(respostas);
}
