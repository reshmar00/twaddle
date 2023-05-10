from flask import Flask
from markupsafe import escape
from flask import request

app = Flask(__name__)


@app.route('/')
def index():
    return 'index'


@app.route('/login')
def login():
    return 'login'
