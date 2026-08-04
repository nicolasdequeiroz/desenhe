/**
 * Backend do livro de visitas desenhado do site da Desenhe.
 *
 * Guarda cada desenho como uma linha da planilha. O traço vai serializado em
 * JSON na última coluna — nada de imagem, então a célula é pequena.
 *
 * Instalação: veja apps-script/README.md.
 */

var SHEET_NAME = 'desenhos';
var MAX_STROKES_CHARS = 40000; // Limite de célula do Sheets é 50k.

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

/** GET ?action=list — devolve os desenhos visíveis, do mais antigo ao mais novo. */
function doGet(e) {
  var sh = sheet_();
  var values = sh.getDataRange().getValues();
  var out = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    // Para moderar, escreva "oculto" na coluna status: a linha some do site.
    if (String(row[3]).toLowerCase() === 'oculto') continue;

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
      'ok',
      strokes
    ]);

    return json_({ok: true});
  } catch (err) {
    return json_({ok: false, error: String(err)});
  }
}
