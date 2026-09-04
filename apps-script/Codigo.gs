/**
 * Backend do livro de visitas desenhado do site da Desenhe.
 *
 * Guarda cada desenho como uma linha da planilha. O traço vai serializado em
 * JSON numa coluna (pequena, é só texto). Uma prévia em PNG é gerada no
 * navegador de quem desenhou (ver renderPreviewBase64 em guestbook.ts): ela
 * vai pro Google Drive, e a planilha guarda só um link "ver imagem" na
 * coluna antes de "tracos" — nada de imagem flutuando por cima da grade. A
 * mesma imagem vai embutida (de verdade, inline) no e-mail de aviso.
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

/** Coluna do link "ver imagem" — antes de "tracos" de propósito. */
var PREVIEW_COLUMN = 5;
/** Pasta no Drive onde as prévias em PNG ficam guardadas. */
var PREVIEW_FOLDER_NAME = 'Desenhe - prévias do livro de visitas';

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['id', 'criado_em', 'nome', 'status', 'previa', 'tracos']);
    return sh;
  }
  migrateToLinkColumn_(sh);
  return sh;
}

/**
 * Versão anterior gravava "tracos" na coluna E e colava uma imagem flutuante
 * na F. Essa migração roda uma vez só (na primeira chamada depois do
 * deploy): insere uma coluna nova antes de "tracos" pro link da prévia,
 * empurrando o que vinha depois — inclusive imagens antigas já coladas —
 * uma casa pra direita. Depois disso o header já tem "previa" na posição
 * certa e a função vira no-op.
 */
function migrateToLinkColumn_(sh) {
  var header = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 5)).getValues()[0];
  if (header[4] === 'tracos') {
    sh.insertColumnBefore(5);
    sh.getRange(1, 5).setValue('previa');
  }
}

/** Pasta do Drive com as prévias, criando na primeira vez se não existir. */
function previewFolder_() {
  var folders = DriveApp.getFoldersByName(PREVIEW_FOLDER_NAME);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(PREVIEW_FOLDER_NAME);
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
      strokes = JSON.parse(row[5] || '[]');
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

    var sh = sheet_();
    // Coluna "previa" (E) fica em branco aqui e é preenchida com o link
    // logo abaixo, só depois que a imagem sobe pro Drive com sucesso.
    sh.appendRow([id, new Date(), name, STATUS_PENDING, '', strokes]);
    var row = sh.getLastRow();

    // Prévia em PNG (ver renderPreviewBase64 em guestbook.ts): sobe pro
    // Drive e vira um link "ver imagem" na planilha, em vez de uma imagem
    // flutuando por cima da grade. Uma falha aqui não derruba o envio — o
    // desenho já está salvo mesmo sem a prévia.
    var previewBlob = null;
    if (body.preview) {
      try {
        var bytes = Utilities.base64Decode(body.preview);
        previewBlob = Utilities.newBlob(bytes, 'image/png', 'desenho-' + id + '.png');
        var file = previewFolder_().createFile(previewBlob);
        sh.getRange(row, PREVIEW_COLUMN).setFormula(
          '=HYPERLINK("' + file.getUrl() + '","ver imagem")'
        );
      } catch (imgErr) {
        previewBlob = null;
      }
    }

    notifyOwner_(id, name, previewBlob);

    return json_({ok: true});
  } catch (err) {
    return json_({ok: false, error: String(err)});
  }
}

/**
 * Avisa por e-mail que chegou desenho novo, com a prévia embutida (quando
 * veio uma) e links de aprovar/recusar de um clique só. Nunca deixa uma
 * falha aqui derrubar o envio do desenho: sem isso, cota de e-mail estourada
 * bloquearia visitas de verdade.
 */
function notifyOwner_(id, name, previewBlob) {
  try {
    var baseUrl = ScriptApp.getService().getUrl();
    var approveUrl =
      baseUrl + '?action=moderate&decision=approve&id=' + encodeURIComponent(id) +
      '&token=' + MOD_SECRET;
    var rejectUrl =
      baseUrl + '?action=moderate&decision=reject&id=' + encodeURIComponent(id) +
      '&token=' + MOD_SECRET;
    var sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

    // `cid:preview` só funciona com `inlineImages` (anexo referenciado por
    // Content-ID); um data: URI direto no <img> é bloqueado pelo Gmail.
    var previewHtml = previewBlob
      ? '<p style="margin:0 0 20px;"><img src="cid:preview" alt="Prévia do desenho" ' +
        'style="max-width:100%;border:1px solid #ddd;border-radius:8px;display:block;"/></p>'
      : '';

    var html =
      '<div style="font-family:sans-serif;font-size:15px;line-height:1.5;">' +
      '<p>Novo desenho no livro de visitas: <strong>' + name + '</strong></p>' +
      previewHtml +
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

    var mail = {
      to: OWNER_EMAIL,
      subject: 'Novo desenho no livro de visitas da Desenhe',
      htmlBody: html
    };
    if (previewBlob) mail.inlineImages = {preview: previewBlob};

    MailApp.sendEmail(mail);
  } catch (err) {
    // Cota de e-mail estourada ou outro erro: o desenho já foi salvo como
    // pendente de qualquer forma, só o aviso que não saiu.
  }
}

/**
 * Rode esta função manualmente uma vez no editor (▶ com "testeEmail"
 * selecionado no menu de funções) sempre que este arquivo ganhar um serviço
 * novo (Mail, Drive, etc.). O Apps Script detecta os escopos precisando de
 * autorização a partir do código do projeto inteiro, então rodar qualquer
 * função manualmente aqui já pede consentimento pra tudo que o script usa —
 * inclusive DriveApp, usado pra guardar as prévias. Sem essa autorização,
 * os recursos que dependem dela falham em silêncio no fluxo normal (os
 * try/catch existem exatamente pra não travar o site por causa disso).
 */
function testeEmail() {
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: 'Teste: livro de visitas da Desenhe',
    htmlBody: 'Se você recebeu isto, o envio de e-mail está autorizado. ✅'
  });
}
