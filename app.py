from flask import Flask, render_template, request, jsonify
from googletrans import Translator
import easyocr
import os
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder="static", template_folder="templates")
translator = Translator()
reader = easyocr.Reader(['en'], gpu=False)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED = {"png","jpg","jpeg","webp","heic"}

@app.route("/")
def index():
    return render_template("index.html")

# ---------------- IMAGE OCR ----------------
@app.route("/translate_image", methods=["POST"])
def translate_image():
    file = request.files.get("image")
    dest = request.form.get("lang","en")
    filename = secure_filename(file.filename)
    ext = filename.rsplit(".",1)[-1].lower()
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)

    results = reader.readtext(path)
    extracted = " ".join([x[1] for x in results])

    translated = translator.translate(extracted, dest=dest).text if extracted else ""

    return jsonify({"extracted_text": extracted, "translated_text": translated})

# ---------------- TEXT TRANSLATION ----------------
@app.route("/translate_text", methods=["POST"])
def translate_text():
    data = request.get_json()
    text = data.get("text","")
    lang = data.get("lang","en")
    translated = translator.translate(text, dest=lang).text
    return jsonify({"translated": translated})

if __name__ == "__main__":
    app.run(debug=True)
