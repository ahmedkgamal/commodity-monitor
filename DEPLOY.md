# Deploying to PythonAnywhere

The "Coming Soon!" page on `https://ahmedkgamal.pythonanywhere.com/` means
PythonAnywhere has no web app configured for the account yet. Follow the steps
below once and the site will go live. After that, every `git pull` + reload
will redeploy.

## 1. Get the code on PythonAnywhere

Open a **Bash console** on PythonAnywhere and run:

```bash
cd ~
git clone https://github.com/ahmedkgamal/commodity-monitor.git
cd commodity-monitor
pip3.10 install --user -r requirements.txt
```

(Use whichever Python version matches the web app you'll create in step 2 —
3.10 is fine.)

## 2. Create the web app

1. Go to the **Web** tab → **Add a new web app**.
2. Domain: `ahmedkgamal.pythonanywhere.com` (default, just click **Next**).
3. Framework: **Flask**.
4. Python version: **3.10**.
5. Path: `/home/ahmedkgamal/commodity-monitor/flask_app.py` (overwrite the
   default path that PythonAnywhere suggests).
6. Click **Next**, wait for the web app to be created.

## 3. Verify the WSGI file

On the **Web** tab, under **Code**, click the **WSGI configuration file**
link. It should already point at `flask_app.py` from step 2 — confirm the
relevant section reads:

```python
import sys
path = '/home/ahmedkgamal/commodity-monitor'
if path not in sys.path:
    sys.path.insert(0, path)

from flask_app import app as application  # noqa
```

Save if you edited it.

## 4. Reload

Click the green **Reload** button at the top of the Web tab. Visit
`https://ahmedkgamal.pythonanywhere.com/` — the dashboard should load.

## Updating after a `git push`

```bash
cd ~/commodity-monitor && git pull
```

Then click **Reload** on the Web tab. (Reload is only needed if Python code
changes; for pure HTML/CSS/JS edits, a hard refresh in the browser is enough.)

## Troubleshooting

- **Still seeing "Coming Soon!"** — the web app wasn't created yet. Repeat
  step 2.
- **`ImportError: No module named flask`** — run the `pip3.10 install` line
  from step 1, then reload.
- **500 error** — check the **Error log** link on the Web tab.
