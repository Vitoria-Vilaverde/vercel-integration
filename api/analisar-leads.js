export default async function handler(req, res) {
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

  // Chama o backend Python do Render:
  const mlResponse = await fetch("https://api-fast-ml.onrender.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leads)
  });
  const mlResults = await mlResponse.json();

  // Monta resposta (exemplo, ajuste como quiser)
  const respostas = leads.map((lead, i) => ({
    ...lead,
    scoreML: mlResults.conversao_probas[i]
  }));


  // 3. **AQUI você insere a chamada ao Apps Script para salvar no Sheets:**
  await fetch("https://script.google.com/macros/s/AKfycbyz_PQgEnO4uvnY04tMUTaEC_2TRP-Ye_EjIv5fXRNCct6zMs9Y3PDSnyeK4Of37Ylb/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(respostas)
  });
  // (você pode ignorar a resposta, pois é só para salvar)

  // 4. Responde normalmente ao frontend
  res.status(200).json(respostas);
}
