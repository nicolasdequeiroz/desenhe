/**
 * Backend do livro de visitas desenhado do site da Desenhe.
 *
 * Guarda cada desenho como uma linha da planilha. O traço vai serializado em
 * JSON na última coluna — nada de imagem, então a célula é pequena.
 *
 * Moderação prévia: todo desenho novo entra com status "pendente" e só fica
 * visível pra todo mundo depois que a coluna status virar "ok". Enquanto
 * isso, o desenho já aparece pra quem o enviou (o site guarda uma cópia no
 * localStorage do navegador de quem desenhou), então a espera é só pros
 * outros visitantes.
 *
 * Aprovação de um clique: o e-mail de aviso já vem com dois links, um que
 * aprova e outro que recusa, sem precisar abrir a planilha. Cada link carrega
 * MOD_SECRET pra ninguém além de quem recebeu o e-mail conseguir moderar
 * (a URL /exec já é pública, quem lê os desenhos).
 *
 * Instalação: veja apps-script/README.md.
 */

var SHEET_NAME = 'desenhos';
var MAX_STROKES_CHARS = 40000; // Limite de célula do Sheets é 50k.
var STATUS_PENDING = 'pendente';
var STATUS_APPROVED = 'ok';
var STATUS_REJECTED = 'oculto';

/** Pra quem vai o aviso de novo desenho. Fixo: nada de Session.*, que pode
 *  vir vazio dependendo de como o Web App foi implantado. */
var OWNER_EMAIL = 'nicolasazevedo38@gmail.com';

/** Senha simples nos links de aprovar/recusar do e-mail. Só quem recebe o
 *  e-mail tem esse valor; sem ele, ninguém aprova nem recusa por fora. */
var MOD_SECRET = 'bf274609a7f23fd8e479786017decda4d870d3bc';

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['id', 'criado_em', 'nome', 'status', 'tracos']);
  }
  return sh;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function html_(message, ok) {
  var color = ok ? '#2f7a3d' : '#a33333';
  return HtmlService.createHtmlOutput(
    '<html><body style="font-family:sans-serif;padding:48px 24px;text-align:center;">' +
    '<p style="font-size:18px;color:' + color + ';max-width:420px;margin:0 auto;">' +
    message +
    '</p></body></html>'
  );
}

/** GET: ?action=moderate aprova/recusa; qualquer outro valor lista os aprovados. */
function doGet(e) {
  var action = e && e.parameter && e.parameter.action;
  if (action === 'moderate') return handleModerate_(e);
  return handleList_();
}

/** Devolve os desenhos aprovados, do mais antigo ao mais novo. */
function handleList_() {
  var sh = sheet_();
  var values = sh.getDataRange().getValues();
  var out = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    // Só aparece pra todo mundo depois de aprovado: escreva "ok" na coluna
    // status. Qualquer outro valor (pendente, oculto, em branco) fica de fora.
    if (String(row[3]).toLowerCase() !== STATUS_APPROVED) continue;

    var strokes;
    try {
      strokes = JSON.parse(row[4] || '[]');
    } catch (err) {
      continue;
    }
    if (!strokes.length) continue;

    out.push({
      id: String(row[0]),
      createdAt: row[1] instanceof Date ? row[1].toISOString() : String(row[1]),
      name: String(row[2] || 'Anônimo'),
      strokes: strokes
    });
  }

  // Só os últimos 60 interessam para a pilha do rodapé.
  return json_(out.slice(-60));
}

/** Aprova ou recusa um desenho pelo link do e-mail (?action=moderate). */
function handleModerate_(e) {
  if (String(e.parameter.token) !== MOD_SECRET) {
    return html_('Link inválido ou expirado.', false);
  }

  var id = String(e.parameter.id || '');
  var decision = e.parameter.decision === 'approve' ? STATUS_APPROVED : STATUS_REJECTED;

  var sh = sheet_();
  var values = sh.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) !== id) continue;

    sh.getRange(i + 1, 4).setValue(decision);
    var name = String(values[i][2] || 'Anônimo');

    return decision === STATUS_APPROVED
      ? html_('Desenho de "' + name + '" aprovado! Já está público no site. ✅', true)
      : html_('Desenho de "' + name + '" recusado. Continua fora do site. 🚫', true);
  }

  return html_('Não achei esse desenho (talvez já tenha sido moderado). 🤔', false);
}

/** POST com o JSON do desenho no corpo (text/plain, para evitar preflight). */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var strokes = JSON.stringify(body.strokes || []);

    if (strokes === '[]') return json_({ok: false, error: 'desenho vazio'});
    if (strokes.length > MAX_STROKES_CHARS) {
      return json_({ok: false, error: 'desenho grande demais'});
    }

    var id = String(body.id || Date.now());
    var name = String(body.name || 'Anônimo').slice(0, 24);

    sheet_().appendRow([id, new Date(), name, STATUS_PENDING, strokes]);

    notifyOwner_(id, name);

    return json_({ok: true});
  } catch (err) {
    return json_({ok: false, error: String(err)});
  }
}

/**
 * Avisa por e-mail que chegou desenho novo, com links de aprovar/recusar de
 * um clique só. Nunca deixa uma falha aqui derrubar o envio do desenho: sem
 * isso, cota de e-mail estourada bloquearia visitas de verdade.
 */
function notifyOwner_(id, name) {
  try {
    var baseUrl = ScriptApp.getService().getUrl();
    var approveUrl =
      baseUrl + '?action=moderate&decision=approve&id=' + encodeURIComponent(id) +
      '&token=' + MOD_SECRET;
    var rejectUrl =
      baseUrl + '?action=moderate&decision=reject&id=' + encodeURIComponent(id) +
      '&token=' + MOD_SECRET;
    var sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

    var html =
      '<div style="font-family:sans-serif;font-size:15px;line-height:1.5;">' +
      '<p>Novo desenho no livro de visitas: <strong>' + name + '</strong></p>' +
      '<p style="margin:24px 0;">' +
      '<a href="' + approveUrl + '" style="display:inline-block;padding:10px 20px;' +
      'margin-right:12px;background:#2f7a3d;color:#fff;text-decoration:none;' +
      'border-radius:6px;font-weight:bold;">✅ Aprovar</a>' +
      '<a href="' + rejectUrl + '" style="display:inline-block;padding:10px 20px;' +
      'background:#a33333;color:#fff;text-decoration:none;border-radius:6px;' +
      'font-weight:bold;">🚫 Recusar</a>' +
      '</p>' +
      '<p style="color:#666;">Ou revise direto na <a href="' + sheetUrl + '">planilha</a>.</p>' +
      '</div>';

    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: 'Novo desenho no livro de visitas da Desenhe',
      htmlBody: html
    });
  } catch (err) {
    // Cota de e-mail estourada ou outro erro: o desenho já foi salvo como
    // pendente de qualquer forma, só o aviso que não saiu.
  }
}

/**
 * Rode esta função manualmente uma vez no editor (▶ com "testeEmail"
 * selecionado no menu de funções) depois de colar este código. Isso força o
 * Google a pedir autorização para o script enviar e-mail: sem essa
 * autorização, MailApp.sendEmail falha silenciosamente no fluxo normal
 * (o erro é engolido pelo try/catch de notifyOwner_ pra não travar o site).
 */
function testeEmail() {
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: 'Teste: livro de visitas da Desenhe',
    htmlBody: 'Se você recebeu isto, o envio de e-mail está autorizado. ✅'
  });
}
