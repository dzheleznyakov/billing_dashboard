Ensure that you have Python 3 and pip installed on your computer.

Tested with Python 3.13.

The following instructions are for Linux/Mac systems.

### Initialise the project

```bash
chmod +x setup.sh
./bin/setup.sh
```

### Run the app

To activate the venv environment and run the server:

```bash
source .venv/bin/activate && uvicorn main:app --reload --log-level debug --port 5000
```

### Run tests

```bash
python -m pytest
```
