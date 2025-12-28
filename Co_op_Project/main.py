from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/guide")
def guide():
    return render_template("guide.html")

@app.route("/collection")
def collection():
    return render_template("collection.html")

@app.route("/news")
def news():
    return render_template("news.html")

@app.route("/dashboard")
def dashboard():
    return render_template("user/dashboard.html")

if __name__ == "__main__":
    app.run(debug=True)
