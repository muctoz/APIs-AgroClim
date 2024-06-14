import requests
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

# Inicializando o aplicativo Firebase (apenas uma vez)
cred = credentials.Certificate(
    "./app-agroclim-firebase-adminsdk-da22m-e12383d0a7.json"
)
firebase_admin.initialize_app(
    cred, {"databaseURL": "https://app-agroclim-default-rtdb.firebaseio.com"}
)

def extrair_dados_tabela_geral(tabela):
    dados_tabela = []
    data_atual = datetime.now().strftime("%d/%m/%Y")
    for linha in tabela.find_all("tr")[1:]:
        colunas = linha.find_all("td")
        if len(colunas) >= 3:
            data = colunas[0].text.strip()
            preco_texto = colunas[1].text.strip()
            variacao_texto = colunas[2].text.strip()
            if preco_texto not in ["***", "s/ cotação", "-", ""]:
                try:
                    preco = float(preco_texto.replace(".", "").replace(",", "."))
                except ValueError:
                    preco = None
            else:
                preco = None
            if variacao_texto not in ["***", "s/ cotação", "-", ""]:
                try:
                    variacao_texto = variacao_texto.replace("%", "")
                    variacao = float(variacao_texto.replace(",", "."))
                except ValueError:
                    variacao = None
            else:
                variacao = None
            try:
                if len(data.split('/')) == 3:
                    dia, mes, ano = map(int, data.split('/'))
                    if 1 <= dia <= 31 and 1 <= mes <= 12 and ano > 2000:
                        data_valida = True
                    else:
                        data_valida = False
                else:
                    data_valida = False
            except ValueError:
                data_valida = False
            if not data_valida:
                data = data_atual
            dados_tabela.append({"Data": data, "Preço": preco, "Variação": variacao})

    return dados_tabela

def processar_produto(nome_produto, tabela_cotacao, img_url, fonte):
    """Processa e salva os dados de cotação no Firebase"""
    ref = db.reference(f"cotacoes/{nome_produto}")
    cotacao_data = extrair_dados_tabela_geral(tabela_cotacao)
    for entrada in cotacao_data:
        ref.set({
            "Data": entrada["Data"],
            "Preço": entrada["Preço"],
            "Variação": entrada["Variação"],
            "Imagem": img_url,
            "Fonte": fonte
        })
    print(f"Cotações de {nome_produto} atualizadas no Firebase!")

def obter_cotacoes_geral():
    url = f"https://www.noticiasagricolas.com.br/cotacoes"
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")

        # Encontrando todos os blocos de cotação
        cotacao_blocos = soup.find_all("div", class_="cotacao")

        for cotacao_bloco in cotacao_blocos:
            nome_produto_elemento = cotacao_bloco.find("h3")
            if nome_produto_elemento:
                nome_produto = nome_produto_elemento.text.strip()
            else:
                nome_produto = "Nome do produto não encontrado"

            img_url = cotacao_bloco.find("img")["data-src"] if cotacao_bloco.find("img") else None
            tabela_cotacao = cotacao_bloco.find("table", class_="cot-fisicas")
            fonte_elemento = cotacao_bloco.find("span")
            fonte = fonte_elemento.text.strip() if fonte_elemento else "Fonte não encontrada"

            if tabela_cotacao:
                if nome_produto in ["Arroz","Feijão", "Milho", "Café", "Laranja"]:
                    processar_produto(nome_produto, tabela_cotacao, img_url, fonte)
                else:
                    print(f"Produto {nome_produto} não está na lista de produtos específicos.")
            else:
                print(f"Tabela de cotações não encontrada para {nome_produto}.")

        return jsonify({"Mensagem": "Cotações atualizadas no Firebase!"})
    else:
        return jsonify({"error": "Falha ao obter a página."}), 500

@app.route("/cotacoes", methods=["GET"])
def obter_cotacoes():
    return obter_cotacoes_geral()

if __name__ == "__main__":
    app.run(debug=True)
