"""WSGI entry point that serves the static commodity-monitor site on PythonAnywhere."""
from pathlib import Path

from flask import Flask, send_from_directory

ROOT = Path(__file__).resolve().parent

app = Flask(__name__, static_folder=None)


@app.route("/")
def index():
    return send_from_directory(ROOT, "index.html")


@app.route("/<path:filename>")
def assets(filename):
    return send_from_directory(ROOT, filename)


if __name__ == "__main__":
    app.run(debug=True)
