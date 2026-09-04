/**
 * Backend do livro de visitas desenhado do site da Desenhe.
 *
 * Guarda cada desenho como uma linha da planilha. O traço vai serializado em
 * JSON na última coluna — nada de imagem, então a célula é pequena.
 *
 * Moderação prévia: todo desenho novo entra com status "pendente" e só fica
 * visível pra todo mundo depois que a coluna status virar "ok" à mão na
 * planilha. Enquanto isso, o desenho já aparece pra quem o enviou (o site
 * guarda uma cópia no localStorage do navegador de quem desenhou), então a
 * espera é só pros outros visitantes.
 *
 * Instalação: veja apps-script/README.md.
 */

var SHEET_NAME = 'desenhos';
var MAX_STROKES_CHARS = 40000; // Limite de célula do Sheets é 50k.
var STATUS_PENDING = 'pendente';
var STATUS_APPROVED = 'ok';

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

/** GET ?action=list — devolve os desenhos aprovados, do mais antigo ao mais novo. */
function doGet(e) {
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

/** POST com o JSON do desenho no corpo (text/plain, para evitar preflight). */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var strokes = JSON.stringify(body.strokes || []);

    if (strokes === '[]') return json_({ok: false, error: 'desenho vazio'});
    if (strokes.length > MAX_STROKES_CHARS) {
      return json_({ok: false, error: 'desenho grande demais'});
    }

    var name = String(body.name || 'Anônimo').slice(0, 24);

    sheet_().appendRow([
      String(body.id || Date.now()),
      new Date(),
      name,
      STATUS_PENDING,
      strokes
    ]);

    notifyOwner_(name);

    return json_({ok: true});
  } catch (err) {
    return json_({ok: false, error: String(err)});
  }
}

/**
 * Avisa por e-mail quem publicou o script (Session.getEffectiveUser(), não
 * getActiveUser(): a implantação roda "Executar como: Eu", então é a
 * identidade efetiva que reflete o dono, mesmo com visitantes anônimos
 * chamando o Web App). Nunca deixa uma falha aqui derrubar o envio do
 * desenho: sem isso, um limite diário de e-mail do Gmail bloquearia visitas
 * de verdade.
 */
function notifyOwner_(name) {
  try {
    var owner = Session.getEffectiveUser().getEmail();
    if (!owner) return;

    var sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
    MailApp.sendEmail(
      owner,
      'Novo desenho no livro de visitas da Desenhe',
      'Nome: ' + name + '\n\n' +
      'Fica pendente até você aprovar: abra a planilha, ache a última linha ' +
      'da aba "desenhos" e troque a coluna status para "ok" pra publicar ' +
      '(ou deixe como está pra não publicar).\n\n' +
      sheetUrl
    );
  } catch (err) {
    // Cota de e-mail estourada ou outro erro: o desenho já foi salvo como
    // pendente de qualquer forma, só o aviso que não saiu.
  }
}
